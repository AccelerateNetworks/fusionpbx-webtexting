<?php
require "../vendor/autoload.php";
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

//set the include path
$conf = glob("{/usr/local/etc,/etc}/fusionpbx/config.conf", GLOB_BRACE);
set_include_path(parse_ini_file($conf[0])['document.root']);

//includes files
require_once "resources/require.php";

function incoming_sms($from, $to, $body) {
	global $domain_uuid, $domain_name;

    $destination = find_destination_for_number($to);
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

    // deliver the webpush notification
    send_webpush($domain_uuid, $extension_uuid, $from, $to, $body);

    // deliver via SIP
    send_sip($domain_uuid, $extension, $from, $to, $body, "text/plain");

    error_log("delivered inbound SMS");

    return true;
}

// incoming_mms($body->From, $body->To, $body->MediaURLs, $body->AdditionalRecipients);
function incoming_mms($from, $to, $attachments, $additional_recipients) {
    global $domain_uuid, $domain_name;

    $destination = find_destination_for_number($to);
    $extension = $destination['extension'];
    $extension_uuid = $destination['extension_uuid'];
    $domain_uuid = $destination['domain_uuid'];
    $domain_name = $destination['domain_name'];

    error_log("additional recipients: ".print_r($additional_recipients, true)."\n");

    error_log("received mms but mms support not yet implemented\n");
    return false;
}

function find_destination_for_number(string $to) {
    $sql = "SELECT v_extensions.extension_uuid, v_extensions.extension, v_domains.domain_uuid, v_domains.domain_name FROM webtexting_destinations,v_extensions, v_domains WHERE webtexting_destinations.phone_number = :to AND webtexting_destinations.domain_uuid = v_domains.domain_uuid AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
    $parameters['to'] = $to;
    $db = new database;
    $destination = $db->select($sql, $parameters, 'row');
    unset($parameters);
    error_log("routing to destination: ".print_r($destination, true));
    if(!$destination) {
        error_log("received message for number with no entry in webtexting_destinations: ".$to);
        return false;
    }

    return $destination;
}

function send_webpush(string $domain_uuid, string $extension_uuid, string $from, string $to, string $body) {
    $sql = "SELECT v_contacts.contact_name_given, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
    $parameters['number'] = $from;
    $parameters['domain_uuid'] = $domain_uuid;
    $database = new database;
    $contact = $database->select($sql, $parameters, 'row');
    unset($parameters);

    $display_name = $from;
    if($contact) {
        $display_name = $contact['contact_name_given']." ".$contact['contact_name_family'];
    }

    $payload = json_encode([
        "display_name" => $display_name,
        "from" => $from,
        "to" => $to,
        "body" => $body
    ]);

    $sql = "SELECT webtexting_clients.* FROM webtexting_clients, webtexting_subscriptions, v_extensions WHERE ";
    $sql .= "v_extensions.extension_uuid = :extension_uuid AND v_extensions.domain_uuid = :domain_uuid AND ";
    $sql .= "webtexting_subscriptions.extension_uuid = v_extensions.extension_uuid AND ";
    $sql .= "(webtexting_subscriptions.remote_identifier = :remote_identifier or webtexting_subscriptions.remote_identifier IS NULL) AND ";
    $sql .= "webtexting_clients.client_uuid = webtexting_subscriptions.client_uuid";
    $parameters['extension_uuid'] = $extension_uuid;
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['remote_identifier'] = $from;
    $targets = $database->select($sql, $parameters, 'all');
    unset($parameters);

    if (!$targets) {
        error_log("no webpush subscriptions for this extension\n");
        return;
    }

    $vapid = ['subject' => 'mailto:admin@example.com'];

    $sql = "SELECT * FROM webtexting_settings WHERE setting = 'vapid_public_key' OR setting = 'vapid_private_key'";
    foreach($database->select($sql, null, 'all') as $key) {
        switch($key['setting']) {
        case 'vapid_public_key':
            $vapid['publicKey'] = $key['value'];
            break;
        case 'vapid_private_key':
            $vapid['privateKey'] = $key['value'];
            break;
        }
    }

    $webPush = new WebPush(['VAPID' => $vapid]);

    foreach ($targets as $target) {
        $webPush->queueNotification(
            Subscription::create([
                'endpoint' => $target['endpoint'],
                'keys' => [
                    'auth' => $target['auth'],
                    'p256dh' => $target['p256dh'],
                ],
            ]),
            $payload,
        );
    }

    foreach ($webPush->flush() as $report) {
        $endpoint = $report->getRequest()->getUri()->__toString();
        if ($report->isSuccess()) {
            continue;
        }

        if(!$report->isSubscriptionExpired()) {
            error_log("unknown error from push endpoint: ".$report->getReason()."\n");
            continue;
        }

        error_log("got expiration from push endpoint, deleting subscription from database\n");

        $sql = "DELETE FROM webtexting_subscriptions USING webtexting_clients WHERE webtexting_subscriptions.client_uuid = webtexting_clients.client_uuid AND webtexting_clients.endpoint = :endpoint";
        $parameters['endpoint'] = $result->subscription->endpoint;
        $database->execute($sql, $parameters);

        $sql = "DELETE FROM webtexting_clients WHERE endpoint = :endpoint";
        $database->execute($sql, $parameters);

        unset($parameters);
    }
}

function send_sip(string $domain_name, string $extension, string $from, string $to, string $body, string $contentType) {
    $sip_profiles = array("websocket"); // TODO: make this list configurable
    $to_address = $extension."@".$domain_name;
    $from_address = $from."@".$domain_name;

    foreach($sip_profiles as $sip_profile) {
        $event_headers = array(
            "Event-Subclass" => "SMS::SEND_MESSAGE",
            "proto" => "sip",
            "dest_proto" => "sip",
            "from" => "sip:".$from,
            "from_user" => $from,
            "from_host" => $domain_name,
            "from_full" => "sip:".$from_address,
            "sip_profile" => $sip_profile,
            "to" => $to_address,
            "to_user" => $extension,
            "to_host" => $domain_name,
            "subject" => "SIMPLE MESSAGE", // is this required? what is it? fusionpbx's sms app does this
            "type" => $contentType,
            "hint" => "the hint", // is this required? what is it? fusionpbx's sms app does this
            "replying" => "true", // what is this?
            "DP_MATCH" => $to_address, // what is this?
            "Content-Length" => strlen($body),
        );
        $cmd = "sendevent CUSTOM\n";
        foreach($event_headers as $k=>$v) {
            $cmd .= "$k: ".$v."\n";
        }

        $cmd .= "\n".$body;
        error_log("sending sms event to profile ".$sip_profile."\n");
        $cmd_response = event_socket_request_cmd($cmd);
    }
}
