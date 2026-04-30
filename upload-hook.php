<?php
declare(strict_types=1);

require_once __DIR__."/vendor/autoload.php";  // composer: aws-sdk, guzzle, classmap autoload of src/ (S3Helper, etc.)
require_once "root.php";                       // FusionPBX: sets DOCUMENT_ROOT + adds /var/www/fusionpbx to include_path
require_once "resources/require.php";          // FusionPBX core: database class, uuid() helper, session bootstrap

// ── Constants ──
// Upload cap is the source-of-truth in nginx; see Fix 8 (fastcgi_param MMS_MAX_UPLOAD_BYTES).
// Fallback kicks in only if nginx hasn't been updated — log loudly so the operator sees it.
// 1 MB aligns with Aerialink's AT&T/Verizon long-code MMS limits; delivery is reliable
// below this threshold.
$maxUploadBytes = (int)($_SERVER['MMS_MAX_UPLOAD_BYTES'] ?? 0);
if ($maxUploadBytes <= 0) {
    error_log("upload-hook: MMS_MAX_UPLOAD_BYTES not set by nginx fastcgi_param — falling back to 1MB. Update nginx config (Fix 8).");
    $maxUploadBytes = 1 * 1024 * 1024;
}
const RATE_LIMIT_PER_HOUR   = 100;                // per extension_uuid
// `text/` prefix covers text/plain, text/csv, text/html, etc. — small category, low risk.
// Zip gets two exact matches because finfo_file() can report either depending on how
// the archive was created; x-zip-compressed is the legacy Windows variant.
const ALLOWED_TYPE_PREFIXES = ['image/', 'video/', 'audio/', 'text/'];
const ALLOWED_TYPES_EXACT   = ['application/pdf', 'application/smil',
                                'application/zip', 'application/x-zip-compressed'];

// ── Method gate ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    die();
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? '-';

// ── Auth (first side-effect-bearing gate) ──
$token = $_GET['token'] ?? '';
if (!preg_match('/^[a-f0-9]{32}$/', $token)) {
    // Cheap shape check before a DB roundtrip; matches Fix 7 format CHECK.
    error_log("upload-hook: auth rejected malformed token from $clientIp");
    http_response_code(401);
    die();
}
$sql = "SELECT extension_uuid, domain_uuid, device_uuid
        FROM linphone_devices WHERE upload_secret = :token";
$rows = (new database)->select($sql, ['token' => $token], 'all');
if (count($rows) !== 1) {
    // UNIQUE constraint (Fix 7) enforces 0 or 1; fail closed on 2+.
    error_log("upload-hook: auth rejected from $clientIp — matched ".count($rows)." rows");
    http_response_code(401);
    die();
}
$device = $rows[0];

// ── Phase 1: capability probe (empty body) ──
// Linphone's first POST has Content-Length: 0. Respond 204 or the client aborts.
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength === 0) {
    http_response_code(204);
    die();
}

// ── Phase 2: multipart upload ──

// Rate-limit check before doing any S3 work.
// SELECT failure here is treated as a hard request failure (503) — if we can't
// read the audit table to count quota, we have no way to enforce rate limiting,
// and silently letting the upload through would let a broken DB silently disable
// the throttle. Fail closed instead.
try {
    $rateAllowed = upload_hook_rate_check($device['extension_uuid']);
} catch (\Throwable $e) {
    error_log("upload-hook: rate-limit query failed for $clientIp: ".$e->getMessage());
    http_response_code(503);
    die();
}
if (!$rateAllowed) {
    upload_hook_audit_log($device, $clientIp, null, null, null, 429);
    http_response_code(429);
    header('Retry-After: 3600');
    die();
}

if (!isset($_FILES['File']) || $_FILES['File']['error'] !== UPLOAD_ERR_OK) {
    $phpErr = $_FILES['File']['error'] ?? 'unset';
    error_log("upload-hook: missing/failed File field (err=$phpErr) from $clientIp");
    upload_hook_audit_log($device, $clientIp, null, null, null, 400);
    http_response_code(400);
    die();
}

$file    = $_FILES['File'];
$tmpPath = $file['tmp_name'];
$size    = (int)$file['size'];

// Cap is whatever nginx is passing via fastcgi_param. nginx enforces client_max_body_size
// at the edge; this check catches any slippage between the two nginx literals.
if ($size <= 0 || $size > $maxUploadBytes) {
    upload_hook_audit_log($device, $clientIp, null, null, $size, 413);
    http_response_code(413);
    die();
}

// Filename: urldecode (Linphone bctbx_escape), then whitelist. Never trust
// $file['name'] directly as an S3 key or filesystem path.
$rawName   = urldecode((string)$file['name']);
$cleanName = upload_hook_sanitize_filename($rawName);

// Content-type: server-side detection; ignore client-declared $file['type'].
$detected = (new finfo(FILEINFO_MIME_TYPE))->file($tmpPath) ?: 'application/octet-stream';
if (!upload_hook_content_type_allowed($detected)) {
    error_log("upload-hook: rejected content-type '$detected' from $clientIp");
    upload_hook_audit_log($device, $clientIp, $cleanName, $detected, $size, 415);
    http_response_code(415);
    die();
}

// ── Load S3 credentials (same pattern as outbound-hook.php) ──
$credSql = "SELECT default_setting_subcategory, default_setting_value
            FROM v_default_settings
            WHERE default_setting_subcategory IN
                ('mms_bucket','mms_bucket_endpoint','aws_access_key_id','aws_secret_key')";
foreach ((new database)->select($credSql, [], 'all') as $cred) {
    $_SESSION['webtexting'][$cred['default_setting_subcategory']]['text']
        = $cred['default_setting_value'];
}

// ── Write to S3 (stream from disk; no file_get_contents of the whole blob) ──
// Unsigned URL — Messages::_outgoing() presigns for carrier delivery.
$key = 'outbound/'.uuid().$cleanName;
try {
    $uploadedUrl = S3Helper::UploadFile($key, $tmpPath, $detected);
} catch (\Throwable $e) {
    error_log("upload-hook: S3 write failed: ".$e->getMessage());
    upload_hook_audit_log($device, $clientIp, $cleanName, $detected, $size, 502);
    http_response_code(502);
    die();
}

// ── Build Linphone RCS response (lowercase tags; type="file" required) ──
$xw = xmlwriter_open_memory();
xmlwriter_start_document($xw, '1.0', 'UTF-8');
xmlwriter_start_element($xw, 'file');
xmlwriter_write_attribute($xw, 'xmlns', 'urn:gsma:params:xml:ns:rcs:rcs:fthttp');

xmlwriter_start_element($xw, 'file-info');
xmlwriter_write_attribute($xw, 'type', 'file');

xmlwriter_start_element($xw, 'file-size');
xmlwriter_text($xw, (string)$size);
xmlwriter_end_element($xw);

xmlwriter_start_element($xw, 'file-name');
xmlwriter_text($xw, $cleanName);   // raw — Linphone will bctbx_unescape
xmlwriter_end_element($xw);

xmlwriter_start_element($xw, 'content-type');
xmlwriter_text($xw, $detected);
xmlwriter_end_element($xw);

xmlwriter_start_element($xw, 'data');
xmlwriter_write_attribute($xw, 'url', $uploadedUrl);
xmlwriter_end_element($xw);

xmlwriter_end_element($xw);  // file-info
xmlwriter_end_element($xw);  // file

// Strict audit on success: rate-limit correctness depends on this row persisting.
// If the INSERT fails, abandon — Linphone marks NotDelivered, user retries; the
// orphan S3 object is cleaned up by the outbound/ lifecycle rule (Fix 8 — 7d retention).
try {
    upload_hook_audit_log($device, $clientIp, $cleanName, $detected, $size, 200, /* strict */ true);
} catch (\Throwable $e) {
    http_response_code(502);
    die();
}

header('Content-Type: application/xml; charset=UTF-8');
echo xmlwriter_output_memory($xw);

// ── Helpers ──

function upload_hook_sanitize_filename(string $raw): string
{
    $base = basename($raw);
    $clean = preg_replace('/[^A-Za-z0-9._-]+/', '_', $base);
    $clean = trim((string)$clean, '._');
    if ($clean === '') {
        return 'file.bin';
    }
    return substr($clean, 0, 200);
}

function upload_hook_content_type_allowed(string $type): bool
{
    foreach (ALLOWED_TYPE_PREFIXES as $prefix) {
        if (strncmp($type, $prefix, strlen($prefix)) === 0) return true;
    }
    return in_array($type, ALLOWED_TYPES_EXACT, true);
}

function upload_hook_rate_check(string $extensionUuid): bool
{
    // Count successful uploads in the last hour for this extension.
    $sql = "SELECT COUNT(*) AS n FROM linphone_upload_log
            WHERE extension_uuid = :euuid
              AND created_at > NOW() - INTERVAL '1 hour'
              AND http_status = 200";
    $row = (new database)->select($sql, ['euuid' => $extensionUuid], 'row');
    return ((int)($row['n'] ?? 0)) < RATE_LIMIT_PER_HOUR;
}

function upload_hook_audit_log(array $device, string $ip,
                               ?string $filename, ?string $contentType,
                               ?int $size, int $status, bool $strict = false): void
{
    $sql = "INSERT INTO linphone_upload_log
            (log_uuid, extension_uuid, domain_uuid, device_uuid,
             source_ip, filename, content_type, size_bytes, http_status, created_at)
            VALUES (:log_uuid, :euuid, :duuid, :dvuuid,
                    :ip, :fn, :ct, :sz, :st, NOW())";
    try {
        (new database)->execute($sql, [
            'log_uuid' => uuid(),
            'euuid'    => $device['extension_uuid'],
            'duuid'    => $device['domain_uuid'],
            'dvuuid'   => $device['device_uuid'],
            'ip'       => $ip,
            'fn'       => $filename,
            'ct'       => $contentType,
            'sz'       => $size,
            'st'       => $status,
        ]);
    } catch (\Throwable $e) {
        error_log("upload-hook: audit insert failed (status=$status): ".$e->getMessage());
        if ($strict) {
            // Caller depends on this row persisting (rate-limit correctness for
            // successful uploads). Re-throw so the caller can fail the request.
            throw $e;
        }
        // Lenient default: failed-upload audit is diagnostic-only — log and swallow.
    }
}
