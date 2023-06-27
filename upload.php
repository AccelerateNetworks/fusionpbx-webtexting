<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once 'vendor/autoload.php';
require_once 'lib/aws.php';

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

$s3 = new Aws\S3\S3Client(
    [
        'version' => 'latest',
        'region'  => 'us-east-1',
        'use_path_style_endpoint' => false,
        'endpoint' => $_SESSION['webtexting']['mms_bucket_endpoint']['text'],
        'credentials' => DigitalOceanSpacesCredentials(),
    ]
);

$uploadPath = "outbound/".uuid()."/".$body->filename;

$cmd = $s3->getCommand('PutObject', [
    'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
    'Key' => $uploadPath,
]);
$request = $s3->createPresignedRequest($cmd, '+1 hour');

echo json_encode(array(
    'upload_url' => $request->getUri(),
    'path' => $uploadPath,
));
