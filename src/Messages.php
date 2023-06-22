<?php
declare(strict_types=1);

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

final class Messages
{

    public static function IncomingSMS(string $from, string $to, string $body)
    {
        $destination = Messages::findDestination($to);

        Messages::Incoming($destination, $from, $to, $body, "text/plain");

        return true;
    }

    /**
     * Called when a new MMS needs to be delivered through the system
     * 
     * @param string $from                  the phone number the message is coming from
     * @param string $to                    the phone number the message was sent to
     * @param array  $attachments           a list of attachments to be sent
     * @param array  $additional_recipients other numbers the message was sent to
     * 
     * @return null
     */
    public static function IncomingMMS($from, $to, $attachments, $additional_recipients)
    {
        $cpim = new CPIM();

        $destination = Messages::findDestination($to);
        $cpim->headers["From"] = "sip:".$from."@".$destination['domain_name'];
        $cpim->headers["To"] = "sip:".$destination['extension']."@".$destination['domain_name'];

        $cc = array();
        foreach ($additional_recipients as $number) {
            $cc[] = "<".$number."@".$destination['domain_name'].">";
        }
        $cpim->headers["CC"] = implode(", ", $cc);

        Messages::Incoming($destination, $from, $to, $cpim->toString(), "message/cpim", $additional_recipients);
    }

    private static function Incoming(array $destination, string $from, string $to, string $body, string $contentType, $additionalRecipients=array())
    {
        $extension = $destination['extension'];
        $extension_uuid = $destination['extension_uuid'];
        $domain_uuid = $destination['domain_uuid'];

        // store message in the database
        Messages::AddMessage('incoming', $extension_uuid, $domain_uuid, $from, $to, $body, $contentType, $additionalRecipients);

        // deliver the webpush notification
        Messages::sendWebPush($domain_uuid, $extension_uuid, $from, $to, $body);
     
        // deliver via SIP
        Messages::SendSIP($domain_uuid, $extension, $from, $to, $body, $contentType);
     
        error_log("delivered inbound message");   
    }

    public static function AddMessage(string $direction, string $extension_uuid, string $domain_uuid, string $from, string $to, string $body, string $contentType, array $additionalRecipients)
    {
        $db = new database;

        $group_uuid = null;
        if (count($additionalRecipients) > 0) {
            $members = $additionalRecipients;
            $members[] = $to;
            sort($members);

            $sql = "SELECT group_uuid FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND members = :members LIMIT 1";
            $parameters['domain_uuid'] = $domain_uuid;
            $parameters['members'] = implode(",", $members);
            $group_uuid = $db->select($sql, $parameters, 'column');
            if (!$group_uuid) {
                $group_uuid = uuid();
                $sql = "INSERT INTO webtexting_groups (group_uuid, domain_uuid, members) VALUES (:group_uuid, :domain_uuid, :members)";
                $parameters['group_uuid'] = $group_uuid;
                $db->execute($sql, $parameters);
            }
            unset($parameters);
        }

        // save the message to the db
        $sql = "INSERT INTO webtexting_messages (message_uuid, extension_uuid, domain_uuid, start_stamp, from_number, to_number, group_uuid, message, direction) VALUES (:message_uuid, :extension_uuid, :domain_uuid, NOW(), :from, :to, :group_uuid, :body, :direction)";
        $parameters['message_uuid'] = uuid();
        $parameters['extension_uuid'] = $extension_uuid;
        $parameters['domain_uuid'] = $domain_uuid;
        $parameters['from'] = $from;
        $parameters['to'] = $to;
        $parameters['group_uuid'] = $group_uuid;
        $parameters['body'] = $body;
        $parameters['direction'] = $direction;
        $db->execute($sql, $parameters);
        unset($parameters);

        // bump the relevant thread
        $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND remote_number = :from AND local_number= :to AND group_uuid IS NULL RETURNING *";
        if ($group_uuid != null) {
            $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND group_uuid = :group_uuid AND local_number= :to RETURNING *";
            $parameters['group_uuid'] = $group_uuid;
        } else {
            $parameters['from'] = $from;
        }
        $parameters['domain_uuid'] = $domain_uuid;
        $parameters['to'] = $to;
        $thread = $db->select($sql, $parameters, 'row');
        if (!$thread) {
            $sql = "INSERT INTO webtexting_threads (domain_uuid, remote_number, local_number, last_message) VALUES (:domain_uuid, :from, :to, NOW())";
            if ($group_uuid != null) {
                $sql = "INSERT INTO webtexting_threads (domain_uuid, group_uuid, local_number, last_message) VALUES (:domain_uuid, :group_uuid, :to, NOW())";
            }
            $db->execute($sql, $parameters);
        }
        unset($parameters);
    }

    private static function findDestination(string $to)
    {
        $sql = "SELECT v_extensions.extension_uuid, v_extensions.extension, v_domains.domain_uuid, v_domains.domain_name FROM webtexting_destinations,v_extensions, v_domains WHERE webtexting_destinations.phone_number = :to AND webtexting_destinations.domain_uuid = v_domains.domain_uuid AND webtexting_destinations.extension_uuid = v_extensions.extension_uuid";
        $parameters['to'] = $to;
        $db = new database;
        $destination = $db->select($sql, $parameters, 'row');
        unset($parameters);
        if (!$destination) {
            error_log("received message for number with no entry in webtexting_destinations: ".$to);
            return false;
        }
    
        return $destination;
    }

    private static function sendWebPush(string $domain_uuid, string $extension_uuid, string $from, string $to, string $body) {
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
    
    private static function SendSIP(string $domain_name, string $extension, string $from, string $to, string $body, string $contentType) {
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
}
