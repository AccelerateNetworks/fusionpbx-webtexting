<?php
session_start();
require_once "root.php";
require_once "resources/require.php";
require_once __DIR__."/../vendor/autoload.php";
//put db call to grab all the c redentials we need for DO, S3, and callpipe.
$sql= "SELECT default_setting_subcategory, default_setting_value FROM v_default_settings  WHERE default_setting_subcategory='auth_secret' OR default_setting_subcategory='auth_email' OR default_setting_subcategory='mms_bucket' OR default_setting_subcategory='mms_bucket_endpoint' OR default_setting_subcategory='aws_access_key_id' OR default_setting_subcategory='aws_secret_key' OR default_setting_subcategory='acceleratenetworks_inbound_token'
ORDER BY default_setting_subcategory DESC";
$db = new database;
$creds = $db->select($sql, 'all');
if($creds){
    $z=0;
    foreach($creds as $cred){
        $creds[$z] = $cred['default_setting_value'];
        $_SESSION['webtexting'][$cred['default_setting_subcategory']]['text'] = $creds[$z];
        $z++;
    }
}
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

    if ($body->{'ClientSecret'} != $_SESSION['webtexting']['acceleratenetworks_inbound_token']['text']) {
        http_response_code(401);
        echo json_encode(array("error" => "invalid client_secret"));
        die();
    }

    $success = false;
    if ($body->{'MessageType'} == "0") {
        $success = Messages::IncomingSMS($body->{'From'}, $body->{'To'}, $body->{'Content'});
    } else {
        $success = Messages::IncomingMMS($body->{'From'}, $body->{'To'}, $body->{'MediaURLs'}, $body->{'AdditionalRecipients'});
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
    return _send(["to" => $to, "msisdn" => $from, "message" => $body]);
}

function outgoing_mms(string $from, string $to, array $attachments)
{
    return _send(["to" => $to, "msisdn" => $from, "mediaURLs" => $attachments]);
}

function _send(array $body)
{
    AccelerateNetworks::ValidateAccessToken();
    $client = new GuzzleHttp\Client();
    $res = $client->request(
        'POST', "https://sms.callpipe.com/message/send", [
            'headers' => [
                'Authorization' => "Bearer ".$_SESSION['webtexting']['acceleratenetworks_api_key']['text'],
            ],
            'http_errors' => false,
            'json' => $body,
        ],
    );
    if($res->getStatusCode() == 200){
        //everything's fine do nothing.
        $responseBody['statusCode'] = $res->getStatusCode();
        $responseBody['ReasonPhrase'] = $res->getReasonPhrase();
        $responseBody['sourceURL'] = "https://sms.callpipe.com/message/send";
        $responseBody['timestamp'] = date("c");
        $responseBody['authToken'] = $_SESSION['webtexting']['acceleratenetworks_api_key']['text'];
        echo(json_encode($responseBody));
        return json_encode($responseBody);
    }
    else{
        error_log("got ".$res->getStatusCode()." ".$res->getReasonPhrase()."\n");
        $responseBody['statusCode'] = $res->getStatusCode();
        $responseBody['ReasonPhrase'] = $res->getReasonPhrase();
        $responseBody['sourceURL'] = "https://sms.callpipe.com/message/send";
        $responseBody['timestamp'] = date("c");
        $responseBody['authToken'] = $_SESSION['webtexting']['acceleratenetworks_api_key']['text'];
        error_log("response body: ".print_r($responseBody, true)."\n");
        echo(json_encode($responseBody));
        return json_encode($responseBody);
    }
}
    
