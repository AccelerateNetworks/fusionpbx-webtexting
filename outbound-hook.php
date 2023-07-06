<?php
if ($_SERVER['REMOTE_ADDR'] != "127.0.0.1") {
    error_log("attempt to forge outbound message from ".$_SERVER['REMOTE_ADDR']);
    http_response_code(401);
    die();
}

require_once "root.php";
require_once "resources/require.php";
require_once __DIR__."/vendor/autoload.php";

$event = json_decode(file_get_contents('php://input'));
if (!$event) {
    error_log("failed to parse request body: ".$postbody);
    http_response_code(400);
    die();
}

$domain_name = $event->{'from_host'};
$extension = $event->{'from_user'};
$to = $event->{'to_user'};
$contentType = $event->type;
$body = urldecode($event->_body);
$dedupeID = $event->{'sip_h_X-Message-ID'};

$sql = "SELECT webtexting_destinations.phone_number, v_domains.domain_uuid, v_extensions.extension_uuid FROM webtexting_destinations, v_domains, v_extensions WHERE v_domains.domain_name = :domain_name AND v_domains.domain_uuid = v_extensions.domain_uuid AND v_extensions.extension = :extension AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
$parameters['domain_name'] = $domain_name;
$parameters['extension'] = $extension;
$db = new database;
$destination = $db->select($sql, $parameters, 'row');
if (!$destination) {
    error_log("dropping outbound message from user with no configured destination: ".$extension."@".$domain_name);
    die();
}
unset($parameters);
$from = $destination['phone_number'];
$domainUUID = $destination['domain_uuid'];
$extensionUUID = $destination['extension_uuid'];

// error_log("sending outbound message from $from ($extension@$domain_name) to $to: $body");

$provider = "accelerate-networks"; // TODO: make this customizable

require __DIR__."/providers/".$provider.".php";

switch($contentType) {
case "text/plain":
    Messages::OutgoingSMS($extensionUUID, $domainUUID, $from, $to, $body, $dedupeID);
    outgoing_sms($from, $to, $body);   
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

        error_log("sending to: ".$to."\n");
    }
    Messages::OutgoingMMS($extensionUUID, $domainUUID, $from, $to, $cpim, $groupUUID, $dedupeID);
    $attachmentURL = S3Helper::GetDownloadURL($cpim->fileURL);
    outgoing_mms($from, $to, array($attachmentURL));
    break;
default:
    error_log("received an outbound message of unknown type: ".$contentType);
    break;
}
