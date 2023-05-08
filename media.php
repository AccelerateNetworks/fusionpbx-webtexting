<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";

use Aws\S3\S3Client;

$s3 = new S3Client([
    'bucket_endpoint' => 'https://accelerate-networks-mms.sfo3.digitaloceanspaces.com',
]);

$cmd = $clientS3->getCommand('PutObject', [
    'Bucket' => $bucket,
    'Key' => $objectKey
]);
$s3->createPresignedRequest($cmd, '+1 day');
