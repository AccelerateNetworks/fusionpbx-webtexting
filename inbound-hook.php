<?php
require __DIR__."/vendor/autoload.php";

$provider = $_GET['provider'];
$providerImportPath = __DIR__."/providers/".$provider.".php";
if (!file_exists($providerImportPath)) {
    error_log("rejecting incoming message for unknown provider: ".$provider);
    http_response_code(400);
    die();
}
require $providerImportPath;

incoming();
