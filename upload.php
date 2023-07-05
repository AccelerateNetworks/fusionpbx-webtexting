<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(400);
    echo "bad request";
    die();
}

$body = json_decode(file_get_contents('php://input'));
header('Content-Type: application/json');

if (!$body->filename) {
    echo json_encode(array("error" => "filename not provided"));
}

$uploadPath = "outbound/".uuid()."/".$body->filename;

echo json_encode(array(
    'upload_url' => S3Helper::GetUploadURL($uploadPath),
    'download_url' => $_SESSION['webtexting']['mms_bucket_endpoint']['text']."/".$_SESSION['webtexting']['mms_bucket']['text']."/".$uploadPath,
));
