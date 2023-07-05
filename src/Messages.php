<?php
declare(strict_types=1);

use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

final class Messages
{

    public static function IncomingSMS(string $from, string $to, string $body)
    {
        $destination = LocalNumber::Get($to);
        if ($destination == null) {
            return false;
        }

        Messages::_incoming($destination, $from, $to, $body, "text/plain");

        return true;
    }

    /**
     * Called when a new MMS needs to be delivered through the system
     * 
     * @param string $from                 the phone number the message is coming from
     * @param string $to                   the phone number the message was sent to
     * @param array  $attachments          a list of attachments to be sent
     * @param array  $additionalRecipients other numbers the message was sent to
     * 
     * @return null
     */
    public static function IncomingMMS(string $from, string $to, array $attachments, array $additionalRecipients)
    {
        $cpim = new CPIM();

        $destination = LocalNumber::Get($to);
        if ($destination == null) {
            return false;
        }

        $cpim->headers["From"] = "sip:".$from."@".$destination->domainName;
        $cpim->headers["To"] = "sip:".$destination->extension."@".$destination->domainName;

        $cc = array();
        foreach ($additionalRecipients as $number) {
            $cc[] = "<".$number."@".$destination->domainName.">";
        }
        $cpim->headers["CC"] = implode(", ", $cc);

        $groupUUID = Messages::_findGroup($destination, $from, $to, $additionalRecipients);
        if ($groupUUID) {
            $cpim->headers["Group-UUID"] = $groupUUID;
        }

        foreach ($attachments as $attachment) {
            $info = S3Helper::GetInfo($attachment);

            if ($info['ContentType'] == "application/smil") {
                continue;
            }

            $c = clone $cpim;
            $c->fileURL = $attachment;
            $c->fileContentType = $info['ContentType'];
            $c->fileSize = $info['ContentLength'];
            Messages::_incoming($destination, $from, $to, $c, "message/cpim", $groupUUID);
        }

        return true;
    }

    private static function _incoming(LocalNumber $destination, string $from, string $to, string|CPIM $body, string $contentType, $groupUUID=null)
    {
        $bodyStr = ($body instanceof CPIM) ? $body->toString() : $body;

        // store message in the database
        Messages::AddMessage('incoming', $destination->extensionUUID, $destination->domainUUID, $from, $to, $bodyStr, $contentType, $groupUUID);

        // generate a pre-signed download URL before delivering it to things that will download it
        if ($body instanceof CPIM) {
            $body->fileURL = S3Helper::GetDownloadURL($body->fileURL);
            $bodyStr = $body->toString();
        }

        // deliver the webpush notification
        Messages::_sendWebPush($destination->domainUUID, $destination->extensionUUID, $from, $to, $bodyStr, $groupUUID);

        // deliver via SIP
        Messages::_sendSIP($destination->domainName, $destination->extension, $from, $to, $bodyStr, $contentType, $groupUUID);
    }

    public static function OutgoingSMS(string $extensionUUID, string $domainUUID, string $from, string $to, string $body)
    {
        $source = LocalNumber::Get($from);
        Messages::_outgoing($source, $to, $from, $body, "text/plain");
    }

    /**
     * Called when a new outbound MMS needs to be delivered the system
     *
     * @param string $from                 the phone number the message is coming from
     * @param string $to                   the phone number the message was sent to
     * @param array  $attachments          a list of attachments to be sent
     * @param array  $additionalRecipients other numbers the message was sent to
     *
     * @return null
     */
    public static function OutgoingMMS(string $extensionUUID, string $domainUUID, string $from, string $to, string $attachment, string $groupUUID=null)
    {
        $cpim = new CPIM();

        $source = LocalNumber::Get($from);
        if ($source == null) {
            return false;
        }

        $cpim->headers["From"] = "sip:".$from."@".$source->domainName;
        $cpim->headers["To"] = "sip:".$source->extension."@".$source->domainName;

        if ($groupUUID) {
            $cpim->headers["Group-UUID"] = $groupUUID;
        }

        $info = S3Helper::GetInfo($attachment);
        $cpim->fileURL = $attachment;
        $cpim->fileContentType = $info['ContentType'];
        $cpim->fileSize = $info['ContentLength'];
        Messages::_outgoing($source, $from, $to, $cpim->toString(), "message/cpim", $groupUUID);

        return true;
    }

    public static function _outgoing(LocalNumber $source, string $to, string $from, string|CPIM $body, string $contentType, $groupUUID=null)
    {
        $bodyStr = ($body instanceof CPIM) ? $body->toString() : $body;

        Messages::AddMessage('outgoing', $source->extensionUUID, $source->domainUUID, $from, $to, $bodyStr, $contentType);

        // generate a pre-signed download URL before delivering it to things that will download it
        if ($body instanceof CPIM) {
            $body->fileURL = S3Helper::GetDownloadURL($body->fileURL);
            $bodyStr = $body->toString();
        }

        Messages::_sendSIP($source->domainName, $source->extension, $from, $to, $bodyStr, $contentType, $groupUUID);
    }

    private static function _findGroup(LocalNumber $localNumber, string $from, string $to, $additionalRecipients): ?string
    {
        $db = new database;

        if (count($additionalRecipients) == 0) {
            return null;
        }

        $members = $additionalRecipients;
        $members[] = $from;
        $members[] = $to;
        sort($members);

        $sql = "SELECT group_uuid FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid AND members = :members LIMIT 1";
        $parameters['domain_uuid'] = $localNumber->domainUUID;
        $parameters['extension_uuid'] = $localNumber->extensionUUID;
        $parameters['members'] = implode(",", $members);
        $groupUUID = $db->select($sql, $parameters, 'column');
        if (!$groupUUID) {
            $groupUUID = uuid();
            $sql = "INSERT INTO webtexting_groups (group_uuid, domain_uuid, extension_uuid, members) VALUES (:group_uuid, :domain_uuid, :extension_uuid, :members)";
            $parameters['group_uuid'] = $groupUUID;
            $db->execute($sql, $parameters);
        }
        unset($parameters);

        return $groupUUID;        
    }

    public static function findRecipients(string $domainUUID, string $extensionUUID, string $ourNumber, string $groupUUID): string
    {
        error_log("finding recipients for group:\ndomainUUID=".$domainUUID."\nextensionUUID=".$extensionUUID."\nourNumber=".$ourNumber."\ngroupUUID=".$groupUUID."\n");
        $sql = "SELECT members FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid AND group_uuid = :group_uuid";
        $parameters['domain_uuid'] = $domainUUID;
        $parameters['extension_uuid'] = $extensionUUID;
        $parameters['group_uuid'] = $groupUUID;
        error_log("finding group members: ".print_r($parameters, true)."\n");
        $db = new database;
        $members = $db->select($sql, $parameters, 'column');
        if (!$members) {
            return null;
        }

        $membersArray = explode(",", $members);
        $membersArray = array_diff($membersArray, array($ourNumber));
        // TODO: drop own number from $members

        return implode(",", $membersArray);
    }

    public static function AddMessage(string $direction, string $extensionUUID, string $domainUUID, string $from, string $to, string $body, string $contentType, string $groupUUID=null)
    {
        $db = new database;

        // save the message to the db
        $sql = "INSERT INTO webtexting_messages (message_uuid, extension_uuid, domain_uuid, start_stamp, from_number, to_number, group_uuid, message, content_type, direction) VALUES (:message_uuid, :extension_uuid, :domain_uuid, NOW(), :from, :to, :group_uuid, :body, :content_type, :direction)";
        $parameters['message_uuid'] = uuid();
        $parameters['extension_uuid'] = $extensionUUID;
        $parameters['domain_uuid'] = $domainUUID;
        $parameters['from'] = $from;
        $parameters['to'] = $to;
        $parameters['group_uuid'] = $groupUUID;
        $parameters['body'] = $body;
        $parameters['content_type'] = $contentType;
        $parameters['direction'] = $direction;
        $db->execute($sql, $parameters);
        unset($parameters);

        // bump the relevant thread
        $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND remote_number = :from AND local_number= :to AND group_uuid IS NULL RETURNING *";
        if ($groupUUID != null) {
            $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND group_uuid = :group_uuid AND local_number= :to RETURNING *";
            $parameters['group_uuid'] = $groupUUID;
        } else {
            $parameters['from'] = $from;
        }
        $parameters['domain_uuid'] = $domainUUID;
        $parameters['to'] = $to;
        $thread = $db->select($sql, $parameters, 'row');
        if (!$thread) {
            $sql = "INSERT INTO webtexting_threads (domain_uuid, remote_number, local_number, last_message) VALUES (:domain_uuid, :from, :to, NOW())";
            if ($groupUUID != null) {
                $sql = "INSERT INTO webtexting_threads (domain_uuid, group_uuid, local_number, last_message) VALUES (:domain_uuid, :group_uuid, :to, NOW())";
            }
            $db->execute($sql, $parameters);
        }
        unset($parameters);
    }

    private static function _sendWebPush(string $domainUUID, string $extensionUUID, string $from, string $to, string $body, ?string $groupUUID)
    {
        $sql = "SELECT v_contacts.contact_name_given, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
        $parameters['number'] = $from;
        $parameters['domain_uuid'] = $domainUUID;
        $database = new database;
        $contact = $database->select($sql, $parameters, 'row');
        unset($parameters);
    
        $displayName = $from;
        if ($contact) {
            $displayName = $contact['contact_name_given']." ".$contact['contact_name_family'];
        }
    
        $payload = json_encode(
            [
            "display_name" => $displayName,
            "from" => $from,
            "to" => $to,
            "body" => $body
            ]
        );
    
        $sql = "SELECT webtexting_clients.* FROM webtexting_clients, webtexting_subscriptions, v_extensions WHERE ";
        $sql .= "v_extensions.extension_uuid = :extension_uuid AND v_extensions.domain_uuid = :domain_uuid AND ";
        $sql .= "webtexting_subscriptions.extension_uuid = v_extensions.extension_uuid AND ";
        $sql .= "(webtexting_subscriptions.remote_identifier = :remote_identifier or webtexting_subscriptions.remote_identifier IS NULL) AND ";
        $sql .= "webtexting_clients.client_uuid = webtexting_subscriptions.client_uuid";
        $parameters['extension_uuid'] = $extensionUUID;
        $parameters['domain_uuid'] = $domainUUID;
        $parameters['remote_identifier'] = $from;
        $targets = $database->select($sql, $parameters, 'all');
        unset($parameters);
    
        if (!$targets) {
            error_log("no webpush subscriptions for this extension\n");
            return;
        }
    
        $vapid = ['subject' => 'mailto:admin@example.com'];
    
        $sql = "SELECT * FROM webtexting_settings WHERE setting = 'vapid_public_key' OR setting = 'vapid_private_key'";
        foreach ($database->select($sql, null, 'all') as $key) {
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
                Subscription::create(
                    [
                    'endpoint' => $target['endpoint'],
                    'keys' => [
                        'auth' => $target['auth'],
                        'p256dh' => $target['p256dh'],
                    ],
                    ]
                ),
                $payload,
            );
        }
    
        foreach ($webPush->flush() as $report) {
            $endpoint = $report->getRequest()->getUri()->__toString();
            if ($report->isSuccess()) {
                continue;
            }
    
            if (!$report->isSubscriptionExpired()) {
                error_log("unknown error from push endpoint: ".$report->getReason()."\n");
                continue;
            }
    
            error_log("got expiration from push endpoint, deleting subscription from database\n");
    
            $sql = "DELETE FROM webtexting_subscriptions USING webtexting_clients WHERE webtexting_subscriptions.client_uuid = webtexting_clients.client_uuid AND webtexting_clients.endpoint = :endpoint";
            $parameters['endpoint'] = $endpoint;
            $database->execute($sql, $parameters);
    
            $sql = "DELETE FROM webtexting_clients WHERE endpoint = :endpoint";
            $database->execute($sql, $parameters);
    
            unset($parameters);
        }
    }
    
    private static function _sendSIP(string $domainName, string $extension, string $from, string $to, string $body, string $contentType, ?string $groupUUID=null)
    {
        $SIPProfiles = array("websocket"); // TODO: make this list configurable
        $toAddress = $extension."@".$domainName;
        $fromAddress = $from."@".$domainName;
    
        foreach ($SIPProfiles as $SIPProfile) {
            $eventHeaders = array(
                "Event-Subclass" => "SMS::SEND_MESSAGE",
                "proto" => "sip",
                "dest_proto" => "sip",
                "from" => "sip:".$from,
                "from_user" => $from,
                "from_host" => $domainName,
                "from_full" => "sip:".$fromAddress,
                "sip_profile" => $SIPProfile,
                "to" => $toAddress,
                "to_user" => $extension,
                "to_host" => $domainName,
                "subject" => "SIMPLE MESSAGE", // is this required? what is it? fusionpbx's sms app does this
                "type" => $contentType,
                "hint" => "the hint", // is this required? what is it? fusionpbx's sms app does this
                "replying" => "true", // what is this?
                "DP_MATCH" => $toAddress, // what is this?
                "Content-Length" => strlen($body),
            );
            if ($groupUUID != null) {
                $eventHeaders['x-group_uuid'] = $groupUUID;
            }

            $cmd = "sendevent CUSTOM\n";
            foreach ($eventHeaders as $k=>$v) {
                $cmd .= "$k: ".$v."\n";
            }
    
            $cmd .= "\n".$body;

            event_socket_request_cmd($cmd);
        }
    }
}
