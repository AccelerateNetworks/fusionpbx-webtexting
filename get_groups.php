<?php
require_once __DIR__ . "/vendor/autoload.php";
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
    echo json_encode(array("error" => "invalid or unauthorized extension", "status" => http_response_code(400)));
    die();
}

$database = new database;

$sql = "select group_uuid,members,name from webtexting_groups where extension_uuid='e56b3909-6107-40c0-ac16-0ce0722aebce' AND domain_uuid=:domain_uuid AND extension_uuid = :extension_uuid;";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $_GET['extension_uuid'];
$groups = $database->select($sql, $parameters, 'all');
if ($groups) {
    //message::add("template deleted.");
} else {
    http_response_code(400);
    message::add("error finding groups.", 'negative');
}
echo (json_encode($groups));
return json_encode($groups);
//       unset($parameters);
//         //do an edit template
//         //$domain_uuid;