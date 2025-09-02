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
    $validNumber = _checkValidDestination($ownNumber[0]);
    //the json_deecode(json_encode()) abomination  is stackoverflow hax 
    //echo($validNumber);
    if($validNumber){
        $registered = json_encode($validNumber);
        echo(json_encode($validNumber));
      return json_encode($validNumber);
    }
}
else{
    echo("Invalid phone number. Contact Accelerate Networks support staff.");
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
        $testcheck = json_decode($responseBody);
        return $responseBody;
    }
    else{
        error_log("got ".$res->getStatusCode()." ".$res->getReasonPhrase()."\n");
        $responseBody = json_encode($res->getBody());
        error_log("response body: ".print_r($responseBody, true)."\n");
    }
}