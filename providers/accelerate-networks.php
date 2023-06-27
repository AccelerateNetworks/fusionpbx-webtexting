<?php

require_once "root.php";
require_once "resources/require.php";

require_once __DIR__."/../vendor/autoload.php";

function incoming()
{
    header("Content-Type: application/json");
    if ($_SERVER['REQUEST_METHOD'] != "POST") {
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

    if ($body->ClientSecret != $accelerate_inbound_token) {
        http_response_code(401);
        echo json_encode(array("error" => "invalid client_secret"));
        die();
    }

    $success = false;
    if ($body->MessageType == "0") {
        $success = Messages::IncomingSMS($body->From, $body->To, $body->Content);
    } else {
        $success = Messages::IncomingMMS($body->From, $body->To, $body->MediaURLs, $body->AdditionalRecipients);
    }

    if ($success) {
        echo json_encode(array("success" => true));
    } else {
        http_response_code(500);
        echo json_encode(array("error" => "failed send, please retry later"));
    }
}

function outgoing_sms(string $from, string $to, string $body)
{
    _send(["to" => $to, "msisdn" => $from, "message" => $body]);
}

function outgoing_mms(string $from, string $to, array $attachments, array $additional_recipients)
{
    if(count($additional_recipients) > 0) {
        $to = $to.",".implode(",", $additional_recipients);
    }

    _send(["to" => $to, "msisdn" => $from, "mediaURLs" => $attachments]);
}

function _send(array $body)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://sms.callpipe.com/message/send");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt(
        $ch, CURLOPT_HTTPHEADER, [
        "Authorization" => "Bearer ".$api_key,
        "Content-Type" => "application/json",
        ]
    );

    curl_exec($ch);
}
