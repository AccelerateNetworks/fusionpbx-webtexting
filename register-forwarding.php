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
$parameters['phone_number'] = $_GET['dialedNumber'];

$ownNumber = $database->select($sql, $parameters, 'all');
unset($parameters);
//if number found continue registration hitting the sms.callpipe api
// else return a legible fail message
if($ownNumber[0]){
    $desiredWebhookURL = "https://".$_SESSION['domain_name']."/app/webtexting/inbound-hook.php?provider=accelerate-networks";
    $validNumber = json_decode(json_encode(_checkValidDestination($ownNumber[0])),true);
    //the above is stackoverflow nonsense 
    //echo($validNumber);
    if($validNumber){
      $registered = _registerForwarding(["dialedNumber" => $ownNumber[0]['phone_number'], "email" => $_GET['email'], "callbackUrl" => $validNumber['callbackUrl'], "clientSecret" => $validNumber['clientSecret']]);
        //return json_encode($registered );
        return $registered;
    }
}
else{
    echo("Invalid phone number. Contact Accelerate Networks support staff.");
}

function _registerForwarding(array $body)
{
    AccelerateNetworks::ValidateAccessToken();
    $client = new GuzzleHttp\Client();
    $res = $client->request(
        'POST', "https://sms.callpipe.com/client/register", [
            'headers' => [
                'Authorization' => "Bearer ".$_SESSION['webtexting']['acceleratenetworks_api_key']['text'],
            ],
            'http_errors' => false,
            'json' => $body,
        ],
    );
    if($res->getStatusCode() == 200){
        //everything's fine do nothing.
        return json_encode($res->getBody()->getContents());
    }
    else{
        error_log("got ".$res->getStatusCode()." ".$res->getReasonPhrase()."\n");
        $responseBody = json_decode($res->getBody()->getContents());
        error_log("response body: ".print_r($responseBody, true)."\n");
    }
}

function _checkValidDestination(array $ownPhone)
{
    $args['asDialed']= $ownPhone['phone_number'];
    AccelerateNetworks::ValidateAccessToken();
    $client = new GuzzleHttp\Client();
    $res = $client->request(
        'GET', "https://sms.callpipe.com/client", [
            'headers' => [
                'Authorization' => "Bearer ".$_SESSION['webtexting']['acceleratenetworks_api_key']['text'],
            ],
            'http_errors' => false,
            'query' => ['asDialed' => $args['asDialed'] ],
        ],
    );
    if($res->getStatusCode() == 200){
        //everything's fine do nothing.
        $responseBody = ($res->getBody()->getContents());
        //echo($responseBody);
        return json_decode($responseBody);
    }
    else{
        error_log("got ".$res->getStatusCode()." ".$res->getReasonPhrase()."\n");
        $responseBody = json_encode($res->getBody());
        error_log("response body: ".print_r($responseBody, true)."\n");
    }
}