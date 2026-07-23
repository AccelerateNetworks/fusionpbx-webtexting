<?php
require_once __DIR__."/vendor/autoload.php";
require_once "root.php";
require_once "resources/require.php";
//require_once "resources/check_auth.php";
require_once "src/AccelerateNetworks.php";

$session_id = session_id();
$status_of_session = session_status();
// if ($_SERVER['REMOTE_ADDR'] != "127.0.0.1") {
//     error_log("attempt to forge outbound message from ".$_SERVER['REMOTE_ADDR']);
//     http_response_code(401);
//     die();
// }

$event = json_decode(file_get_contents('php://input'));
if (!$event) {
    error_log("outbound-hook: failed to parse request body");
    http_response_code(400);
    die();
}

// ── Shared: domain is always from_host ──
$domain_name = $event->from_host;

// ── Normalize fields based on payload source ──
// Web UI sends extensionUUID (camelCase); FS event has extension_uuid (set by chatplan user_data)
//
// rawurldecode (RFC 3986) used on both branches:
//
// - FS-event branch: paired with lua/index.lua's `uriescape`, which encodes literal `+` as
//   `%2B` (step 1) and whitespace as `%20` (step 2 — see Lua comment there). mod_curl
//   decodes `%XX` in transit but leaves `+` literal. rawurldecode here is the matching
//   decoder; effectively a no-op for properly-encoded bodies, defensive against residue.
//   IMPORTANT: do NOT switch to urldecode without also reverting the Lua line-12 fix —
//   the encoder and decoder must be consistent (RFC 3986 throughout). Mismatched
//   urldecode form-urlencoded behavior would mangle literal `+` to space.
//
// - Web UI branch: frontend sends raw JSON (no `encodeURIComponent`/`encodeURI`), so
//   $event->body and $event->id arrive as raw values from json_decode. rawurldecode is
//   a no-op for these; chosen for consistency and to incidentally fix a latent
//   `+`-corruption bug where urldecode would have mangled user-entered literal `+`.

if (isset($event->extensionUUID)) {
    // Web UI payload (Ian's webtexting)
    $to = $event->to;
    $contentType = $event->contentType;
    $body = rawurldecode($event->body);
    $dedupeID = rawurldecode($event->id);
    $extensionUUID = $event->extensionUUID;
} else {
    // FreeSWITCH event payload (from chatplan Lua via mod_curl)
    // extension_uuid set by chatplan: ${user_data(${from_user}@${from_host} var extension_uuid)}
    $to = $event->to_user;
    $contentType = isset($event->type) ? $event->type : 'text/plain';
    $body = isset($event->_body) ? rawurldecode($event->_body) : '';
    $dedupeID = isset($event->{'sip_h_X-Message-ID'}) ? $event->{'sip_h_X-Message-ID'} : uuid();
    $extensionUUID = $event->extension_uuid;
}

// ── Shared: look up phone number + domain UUID from extensionUUID (original query) ──
$sql = "SELECT webtexting_destinations.phone_number, v_domains.domain_uuid FROM webtexting_destinations, v_domains, v_extensions WHERE v_domains.domain_name = :domain_name AND v_domains.domain_uuid = v_extensions.domain_uuid AND v_extensions.extension_uuid = :extensionUUID AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
$parameters['domain_name'] = $domain_name;
$parameters['extensionUUID'] = $extensionUUID;
$db = new database;
$destination = $db->select($sql, $parameters, 'row');
if (!$destination) {
    error_log("outbound-hook: no configured destination for ".$extensionUUID."@".$domain_name);
    http_response_code(404);
    die();
}
unset($parameters);
$from = $destination['phone_number'];
$domainUUID = $destination['domain_uuid'];
$sql= "SELECT default_setting_subcategory, default_setting_value FROM v_default_settings  WHERE default_setting_subcategory='auth_secret' OR default_setting_subcategory='auth_email' OR default_setting_subcategory='mms_bucket' OR default_setting_subcategory='mms_bucket_endpoint' OR default_setting_subcategory='aws_access_key_id' OR default_setting_subcategory='aws_secret_key' OR default_setting_subcategory='acceleratenetworks_inbound_token' 
ORDER BY default_setting_subcategory DESC";
$db = new database;
$creds = $db->select($sql, 'all');
if($creds){
    $z=0;
    foreach($creds as $cred){
        $creds[$z] = $cred['default_setting_value'];
        $z++;
    }
}
// error_log("sending outbound message from $from ($extension@$domain_name) to $to: $body");

$provider = "accelerate-networks"; // TODO: make this customizable

require __DIR__."/providers/".$provider.".php";

$message_uuid = $dedupeID;

// Group-UUID is captured here (pre-switch) so it survives the text/plain unwrap
// below. If we waited to read it inside `case "message/cpim":`, the unwrap block
// would have already mutated $contentType to 'text/plain' and the CPIM's group
// context would be lost when the text/plain switch case calls OutgoingSMS.
$groupUUID = null;

// Unwrap CPIM envelope by inner content type. Post-Fix-2f, Linphone wraps ALL
// outbound messages in CPIM — SMS, IMDN, typing indicators, and MMS alike.
// Dispatch on the inner type so the existing per-type cases still work.
if ($contentType === 'message/cpim') {
    $cpim = CPIM::fromString($body);
    $groupUUID = $cpim->getHeader('Group-UUID');
    $innerContentType = $cpim->getHeader('content-type');

    // Drop notifications that have no carrier-side equivalent
    if ($innerContentType && (
        stripos($innerContentType, 'message/imdn') !== false ||
        stripos($innerContentType, 'application/im-iscomposing') !== false
    )) {
        error_log("outbound-hook: dropping CPIM-wrapped ".$innerContentType);
        http_response_code(200);
        die();
    }

    // Unwrap text/plain so the existing text/plain case handles carrier SMS dispatch
    if ($innerContentType && stripos($innerContentType, 'text/plain') !== false) {
        $body = $cpim->body;
        $contentType = 'text/plain';
    }

    // Otherwise (file-transfer XML): fall through to the message/cpim case
}

switch($contentType) {
case "text/plain":
    // Group-context handling for text messages: when $groupUUID was captured
    // pre-switch (see the CPIM unwrap block above), inflate $to to the CSV of
    // group members so carrier dispatch fans out to all recipients, and pin the
    // response's thread key to the group_uuid instead of a single number.
    // Mirrors the same-shaped block in `case "message/cpim":` below.
    if ($groupUUID) {
        $to = Messages::findRecipients($domainUUID, $extensionUUID, $from, $groupUUID);
        if ($to == null) {
            error_log("dropping message for unknown group: domain_uuid=".$domainUUID." extension_uuid=".$extensionUUID." group_uuid=".$groupUUID."\n");
            die();
        }
        $mixins['key'] = $groupUUID;
    }
    $message_uuid = Messages::OutgoingSMS($extensionUUID, $domainUUID, $from, $to, $body, $message_uuid, $groupUUID);
    if(!$message_uuid){
        error_log("failed to write outgoing SMS message record to database for $from to $to");
        http_response_code(501);
        die();
    }
    $response = outgoing_sms($from, $to, $body);
    $response = json_decode($response);
    if(!$response){
        error_log("failed to send outgoing SMS message from $from to $to");
        http_response_code(504);
        die();
    }
        if($response->statusCode == 200){
            Messages::UpdateStatus( $message_uuid,  true, $extensionUUID);
        }
        else{
            //TODO recover this fail state
            error_log("failed to update send status for outgoing SMS message from $from to $to: ".$response->error);
            http_response_code(505);
            die();
        }

    // db update message status to true
    $mixins['id'] = $message_uuid;
    if (!isset($mixins['key'])) {
        $mixins['key'] = $to;
    }
    $extended = (object) array_merge((array)$response, (array)$mixins);
    echo json_encode($extended);
    return json_encode($extended);
    break;
case "message/cpim":
    if ($groupUUID) {
        $to = Messages::findRecipients($domainUUID, $extensionUUID, $from, $groupUUID);
        if ($to == null) {
            error_log("dropping message for unknown group: domain_uuid=".$domainUUID." extension_uuid=".$extensionUUID." group_uuid=".$groupUUID."\n");
            die();
        }
        $mixins['key'] = $groupUUID;
        error_log("sending to: ".$to."\n");
    }
    $message_uuid = Messages::OutgoingMMS($extensionUUID, $domainUUID, $from, $to, $cpim,  $message_uuid,  $groupUUID );
    if(!$message_uuid){
        error_log("failed to write outgoing SMS message record to database for $from to $to");
        http_response_code(501);
        die();
    }
    $response = outgoing_mms($from, $to, array($cpim->fileURL));
    $response = json_decode($response);
    if(!$response){
        error_log("failed to send outgoing SMS message from $from to $to");
        http_response_code(504);
        die();
    }
        if($response->statusCode == 200){
            Messages::UpdateStatus( $message_uuid,  true, $extensionUUID);
        }
        else{
            error_log("failed to update send status for outgoing SMS message from $from to $to: ".$response->error);
            http_response_code(505);
            die();
        }
    
    // $cpim->fileURL gets mutated by Messages::OutgoingMMS to include the auth query params
    $mixins['id'] = $message_uuid;
    if(!isset($mixins['key'])){
        $mixins['key'] = $to;
    }
    $extended = (object) array_merge((array)$response, (array)$mixins);
    echo json_encode($extended);
    return json_encode($extended);
    break;
default:
    error_log("received an outbound message of unknown type: ".$contentType);
    break;
}
