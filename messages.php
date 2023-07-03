<?php
require_once __DIR__."/vendor/autoload.php";
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";

header("Content-Type: application/json");

foreach ($_SESSION['user']['extension'] as $ext) {
    if ($ext['extension_uuid'] == $_GET['extension_uuid']) {
        $extension = $ext;
        break;
    }
}

if (!$extension) {
    http_response_code(400);
    echo json_encode(array("error" => "invalid or unauthorized extension"));
    die();
}

$database = new database;

$sql = "SELECT content_type, direction, from_number, message, start_stamp, to_number, group_uuid FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
if ($_GET['group']) {
    $sql .= "group_uuid = :group_uuid";
    $parameters['group_uuid'] = $_GET['group'];
} else {
    $sql .= "(from_number = :number OR to_number = :number) AND group_uuid IS NULL";
    $parameters['number'] = $_GET['number'];
}
$sql .= " ORDER BY start_stamp DESC LIMIT 10";
$parameters['extension_uuid'] = $extension['extension_uuid'];
$parameters['domain_uuid'] = $domain_uuid;
$messages = $database->select($sql, $parameters, 'all');
unset($parameters);

foreach ($messages as $i => $message) {
    if ($message['content_type'] != "message/cpim") {
        continue;
    }

    // generate a pre-signed download URL before delivering it to things that will download it
    $body = CPIM::fromString($message['message']);
    $body->fileURL = S3Helper::GetDownloadURL($body->fileURL);
    $messages[$i]['message'] = $body->toString();
}


echo json_encode(array("messages" => $messages));
