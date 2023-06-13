<?php
//set the include path
$conf = glob("{/usr/local/etc,/etc}/fusionpbx/config.conf", GLOB_BRACE);
set_include_path(parse_ini_file($conf[0])['document.root']);

//includes files
require_once "resources/require.php";

$debug = true;

function incoming_sms($from, $to, $body) {
	global $debug, $domain_uuid, $domain_name;

    if($debug) {
        error_log("received message from ".$from." to ".$to);
    }

    $db = new database;

    // look up which domain this number is routed to
    $sql = "SELECT v_extensions.extension_uuid, v_extensions.extension, v_domains.domain_uuid, v_domains.domain_name FROM webtexting_destinations,v_extensions, v_domains WHERE webtexting_destinations.phone_number = :to AND webtexting_destinations.domain_uuid = v_domains.domain_uuid AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
    $parameters['to'] = $to;
    $destination = $db->select($sql, $parameters, 'row');
    unset($parameters);
    error_log("routing to destination: ", print_r($destination, true));
    if(!$destination) {
        error_log("received message for number with no entry in webtexting_destinations: ".$to);
        return false;
    }

    $extension = $destination['extension'];
    $extension_uuid = $destination['extension_uuid'];
    $domain_uuid = $destination['domain_uuid'];
    $domain_name = $destination['domain_name'];

    // save the message to the db
    $sql = "INSERT INTO webtexting_messages (message_uuid, extension_uuid, domain_uuid, start_stamp, from_number, to_number, message, direction) VALUES (:message_uuid, :extension_uuid, :domain_uuid, NOW(), :from, :to, :body, 'inbound')";
    $parameters['message_uuid'] = uuid();
    $parameters['extension_uuid'] = $extension_uuid;
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['from'] = $from;
    $parameters['to'] = $to;
    $parameters['body'] = $body;
    $db->execute($sql, $parameters);
    unset($parameters);

    // bump the relevant thread
    $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND remote_number = :from AND local_number= :to AND group_uuid IS NULL RETURNING *";
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['from'] = $from;
    $parameters['to'] = $to;
    $thread = $db->select($sql, $parameters, 'row');
    error_log("bumped thread: ".print_r($thread, true));
    if(!$thread) {
        $sql = "INSERT INTO webtexting_threads (domain_uuid, remote_number, local_number, last_message) VALUES (:domain_uuid, :from, :to, NOW())";
        $db->execute($sql, $parameters);
    }
    unset($parameters);

    // create the event socket connection and send the event socket command
    // $fp = event_socket_create($_SESSION['event_socket_ip_address'], $_SESSION['event_socket_port'], $_SESSION['event_socket_password']);
    // if (!$fp) {
    //     error_log("Connection to Event Socket failed");
    //     return false;
    // }

    $sip_profiles = array("webrtc"); // TODO: make this list configurable
    $to_address = $extension."@".$domain_name;
    foreach($sip_profiles as $sip_profile) {
        $event_headers = array(
            "proto" => "sip",
            "dest_proto" => "sip",
            "from" => "sip:".$from,
            "from_user" => $from,
            "from_host" => $domain_name,
            "full_from" => "sip:".$from."@".$domain_name,
            "sip_profile" => $sip_profile,
            "to" => $to_address,
            "to_user" => $extension,
            "to_host" => $domain_name,
            "subject" => "SIMPLE MESSAGE", // is this required? what is it? fusionpbx's sms app does this
            "type" => "text/plain",
            "hint" => "the hint", // is this required? what is it? fusionpbx's sms app does this
            "replying" => "true", // what is this?
            "DP_MATCH" => $to_address, // what is this?
            "Content-Length" => strlen($body),
        );
        $cmd = "sendevent CUSTOM SMS::SEND_MESSAGE\n";
        foreach($event_headers as $k=>$v) {
            $cmd .= "$k: ".urlencode($v)."\n";
        }
        
        $cmd .= "\n".$body;
        error_log("sending event to profile ".$sip_profile.": ".$cmd."\n");
        $cmd_response = event_socket_request_cmd($cmd);
        error_log("sending event returned response: ".print_r($cmd_response, true)."\n");
    }

    error_log("delivered inbound SMS");

    return true;
}

// incoming_mms($body->From, $body->To, $body->MediaURLs, $body->AdditionalRecipients);
function incoming_mms($from, $to, $attachments, $additional_recipients) {
    error_log("received mms but mms support not yet implemented");
    return false;
}
