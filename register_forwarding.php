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

// get user's number
$sql = "SELECT phone_number FROM webtexting_destinations WHERE phone_number = :phone_number AND extension_uuid = :extension_uuid";
$parameters['extension_uuid'] = $extension['extension_uuid'];
$parameters['phone_number'] = $_GET['own_number'];

$ownNumber = $database->select($sql, $parameters, 'all');
unset($parameters);
//if number found continue registration hitting the sms.callpipe api
// else return a legible fail message