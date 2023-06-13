<?php
include __DIR__."/../lib/incoming.php";
header("Content-Type: application/json");
if($_SERVER['REQUEST_METHOD'] != "POST") {
    http_response_code(405);
    echo json_encode(array("error" => "method not allowed"));
    die();
}
$body = json_decode(file_get_contents('php://input'));

// $body has:
// * ClientSecret
// * From
// * To
// * Content
// * MessageType
// * AdditionalRecipients
// * MediaURLs

// TODO: check inbound token
$accelerate_inbound_token = "...";

if($body->ClientSecret != $accelerate_inbound_token) {
    http_response_code(401);
    echo json_encode(array("error" => "invalid client_secret"));
    die();
}

$success = false;
if($body->MessageType == "0") {
    $success = incoming_sms($body->From, $body->To, $body->Content);
} else {
    $success = incoming_mms($body->From, $body->To, $body->MediaURLs, $body->AdditionalRecipients);
}

if($success) {
    echo json_encode(array("success" => true));
} else {
    http_response_code(500);
    echo json_encode(array("error" => "failed send, please retry later"));
}
