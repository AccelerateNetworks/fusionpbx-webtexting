<?php
include __DIR__."/lib/incoming.php";

$provider = $_GET['provider'];
$provider_import_path = __DIR__."/providers/".$provider.".php";
if(!file_exists($provider_import_path)) {
    error_log("rejecting incoming message for unknown provider: ".$provider);
    http_response_code(400);
    die();
}

incoming();
