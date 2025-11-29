<?php
require_once __DIR__."/vendor/autoload.php";
require_once "root.php";
require_once "resources/require.php";
//require_once "resources/check_auth.php";
require_once "src/AccelerateNetworks.php";

$session_id = session_id();
$status_of_session = session_status();
// if ($_SERVER['REMOTE_ADDR'] != "127.0.0.1") {
//     error_log("attempt to forge outbound message from ".$_SERVER['REMOTE_ADDR']);
//     http_response_code(401);
//     die();
// }

$event = json_decode(file_get_contents('php://input'));
// if (!$event) {
//     error_log("failed to parse request body: ".$postbody);
//     http_response_code(400);
//     die();
// }

$domain_name = $event->{'from_host'};
$from = $event->from; 
$to = $event->to;
$contentType = $event->contentType;
$body = urldecode($event->body);
$dedupeID = random_bytes(16);
$message_uuid = urldecode($event->id);

    $extensionUUID = $event->extensionUUID;
    $sql = "SELECT webtexting_destinations.phone_number, v_domains.domain_uuid FROM webtexting_destinations, v_domains, v_extensions WHERE v_domains.domain_name = :domain_name AND v_domains.domain_uuid = v_extensions.domain_uuid AND v_extensions.extension_uuid = :extensionUUID AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
    $parameters['domain_name'] = $domain_name;
    $parameters['extensionUUID'] = $extensionUUID;
    $db = new database;
    $destination = $db->select($sql, $parameters, 'row');
    if (!$destination) {
        error_log("dropping outbound message from user with no configured destination: ".$extension."@".$domain_name);
        die();
    }

unset($parameters);
$from = $destination['phone_number'];
$domainUUID = $destination['domain_uuid'];
$sql= "SELECT default_setting_subcategory, default_setting_value FROM v_default_settings  WHERE default_setting_subcategory='auth_secret' OR default_setting_subcategory='auth_email' OR default_setting_subcategory='mms_bucket' OR default_setting_subcategory='mms_bucket_endpoint' OR default_setting_subcategory='aws_access_key_id' OR default_setting_subcategory='aws_secret_key' OR default_setting_subcategory='acceleratenetworks_inbound_token' 
ORDER BY default_setting_subcategory DESC";
$db = new database;
$creds = $db->select($sql, 'all');
if($creds){
    $z=0;
    foreach($creds as $cred){
        $creds[$z] = $cred['default_setting_value'];
        $z++;
    }
}
// error_log("sending outbound message from $from ($extension@$domain_name) to $to: $body");

$provider = "accelerate-networks"; // TODO: make this customizable

require __DIR__."/providers/".$provider.".php";

switch($contentType) {
case "text/plain":
    $message_uuid = Messages::OutgoingSMS($extensionUUID, $domainUUID, $from, $to, $body, $message_uuid);
    if(!$message_uuid){
        error_log("failed to write outgoing SMS message record to database for $from to $to");
        http_response_code(501);
        die();
    }
    $response = outgoing_sms($from, $to, $body);  
    $response = json_decode($response);
    if(!$response){
        error_log("failed to send outgoing SMS message from $from to $to");
        http_response_code(504);
        die();
    }
        if($response->statusCode == 200){
            Messages::UpdateStatus( $message_uuid,  true, $extensionUUID);
        }
        else{
            //TODO recover this fail state
            error_log("failed to update send status for outgoing SMS message from $from to $to: ".$response->error);
            http_response_code(505);
            die();
        }
    
    // db update message status to true
    $mixins['id'] = $message_uuid;
    $mixins['key'] = $to;
    $extended = (object) array_merge((array)$response, (array)$mixins);
    echo json_encode($extended);
    return json_encode($extended);
    break;
case "message/cpim":
    $cpim = CPIM::fromString($body);
    $groupUUID = $cpim->getHeader('Group-UUID');
    if ($groupUUID) {
        $to = Messages::findRecipients($domainUUID, $extensionUUID, $from, $groupUUID);
        if ($to == null) {
            error_log("dropping message for unknown group: domain_uuid=".$domainUUID." extension_uuid=".$extensionUUID." group_uuid=".$groupUUID."\n");
            die();
        }
        $mixins['key'] = $groupUUID;
        error_log("sending to: ".$to."\n");
    }
    $message_uuid = Messages::OutgoingMMS($extensionUUID, $domainUUID, $from, $to, $cpim,  $message_uuid,  $groupUUID );
    if(!$message_uuid){
        error_log("failed to write outgoing SMS message record to database for $from to $to");
        http_response_code(501);
        die();
    }
    $response = outgoing_mms($from, $to, array($cpim->fileURL));
    $response = json_decode($response);
    if(!$response){
        error_log("failed to send outgoing SMS message from $from to $to");
        http_response_code(504);
        die();
    }
        if($response->statusCode == 200){
            Messages::UpdateStatus( $message_uuid,  true, $extensionUUID);
        }
        else{
            error_log("failed to update send status for outgoing SMS message from $from to $to: ".$response->error);
            http_response_code(505);
            die();
        }
    
    // $cpim->fileURL gets mutated by Messages::OutgoingMMS to include the auth query params
    $mixins['id'] = $message_uuid;
    if(!isset($mixins['key'])){
        $mixins['key'] = $to;
    }
    $extended = (object) array_merge((array)$response, (array)$mixins);
    echo json_encode($extended);
    return json_encode($extended);
    break;
default:
    error_log("received an outbound message of unknown type: ".$contentType);
    break;
}
