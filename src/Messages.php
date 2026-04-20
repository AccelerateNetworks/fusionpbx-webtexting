<?php
declare(strict_types=1);
require_once "app/webtexting/sse.php";
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

        Messages::_incoming($destination, $from, $to, $body, "text/plain", null);

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

        $cpim->headers["From"] = "sip:" . $from . "@" . $destination->domainName;
        $cpim->headers["To"] = "sip:" . $destination->extension . "@" . $destination->domainName;

        $cc = array();
        foreach ($additionalRecipients as $number) {
            $cc[] = "<" . $number . "@" . $destination->domainName . ">";
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

    private static function _incoming(LocalNumber $destination, string $from, string $to, $body, string $contentType, ?string $groupUUID)
    {
        $bodyStr = ($body instanceof CPIM) ? $body->toString() : $body;
        $message_uuid = uuid();
        // store message in the database
        $messageUUID = Messages::Save('incoming', $destination->extensionUUID, $destination->domainUUID, $from, $to, $bodyStr, $contentType, $message_uuid, $groupUUID);

        // generate a pre-signed download URL before delivering it to things that will download it
        if ($body instanceof CPIM) {
            $body->fileURL = S3Helper::GetDownloadURL($body->fileURL);
            $bodyStr = $body->toString();
            // deliver the webpush notification with "MMS Message" instead of an xml
            //todo figure out how to add groupuuid to the payload 
            Messages::_sendWebPush($destination->domainUUID, $destination->extensionUUID, $from, $to, "MMS Message", $groupUUID);
        } else {
            // deliver the webpush notification 
            Messages::_sendWebPush($destination->domainUUID, $destination->extensionUUID, $from, $to, $bodyStr, $groupUUID);
        }

        // deliver via SIP
        Messages::_sendSIP($destination->domainName, $destination->extension, $from, $to, $bodyStr, $contentType, $messageUUID, $groupUUID, null, true);
    }

    public static function OutgoingSMS(string $extensionUUID, string $domainUUID, string $from, string $to, string $body, string $messageUUID)
    {
        $source = LocalNumber::Get($from);
        if ($source == null) {
            return false;
        }
        $responseUUID = Messages::_outgoing($source, $to, $from, $body, "text/plain", $messageUUID, null);
        return $responseUUID;
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
    public static function OutgoingMMS(string $extensionUUID, string $domainUUID, string $from, string $to, CPIM $body, string $messageUUID, ?string $groupUUID)
    {
        $source = LocalNumber::Get($from);
        if ($source == null) {
            return false;
        }
        if ($groupUUID) {
            $responseUUID = Messages::_outgoing($source, $to, $from, $body, "message/cpim", $messageUUID, $groupUUID);
        } else {
            $responseUUID = Messages::_outgoing($source, $to, $from, $body, "message/cpim", $messageUUID, null);

        }

        return $responseUUID;
    }

    public static function _outgoing(LocalNumber $source, string $to, string $from, $body, string $contentType, string $messageUUID, ?string $groupUUID)
    {
        $bodyStr = ($body instanceof CPIM) ? $body->toString() : $body;
        if ($groupUUID) {
            $response = Messages::Save('outgoing', $source->extensionUUID, $source->domainUUID, $from, $to, $bodyStr, $contentType, $messageUUID, $groupUUID);
        } else {
            $response = Messages::Save('outgoing', $source->extensionUUID, $source->domainUUID, $from, $to, $bodyStr, $contentType, $messageUUID, null);

        }
        // generate a pre-signed download URL before delivering it to things that will download it
        if ($body instanceof CPIM) {
            $body->fileURL = S3Helper::GetDownloadURL($body->fileURL);
            $bodyStr = $body->toString();
        }
        return $response;
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
        error_log("finding recipients for group:\ndomainUUID=" . $domainUUID . "\nextensionUUID=" . $extensionUUID . "\nourNumber=" . $ourNumber . "\ngroupUUID=" . $groupUUID . "\n");
        $sql = "SELECT members FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid AND group_uuid = :group_uuid";
        $parameters['domain_uuid'] = $domainUUID;
        $parameters['extension_uuid'] = $extensionUUID;
        $parameters['group_uuid'] = $groupUUID;
        error_log("finding group members: " . print_r($parameters, true) . "\n");
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

    public static function Save(string $direction, string $extensionUUID, string $domainUUID, string $from, string $to, string $body, string $contentType, string $messageUUID, ?string $groupUUID): string
    {
        $db = new database;
        // check if uuid collides
        //if collides, generate a new one
        // $sql = "SELECT message_uuid FROM webtexting_messages WHERE message_uuid = :message";
        // $parameters['message'] = $messageUUID;
        // $uuid_in_use = $db->execute($sql, $parameters);
        // unset($parameters);


        $local_number = $from;
        $remote_number = $to;
        if ($direction == "incoming") {
            $local_number = $to;
            $remote_number = $from;
        }

        // save the message to the db
        //TODO: add status column
        $sql = "INSERT INTO webtexting_messages (message_uuid, extension_uuid, domain_uuid, start_stamp, from_number, to_number, group_uuid, message, content_type, direction) VALUES (:message_uuid, :extension_uuid, :domain_uuid, NOW(), :from, :to, :group_uuid, :body, :content_type, :direction)";
        $parameters['message_uuid'] = $messageUUID;
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
        $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND remote_number = :remote_number AND local_number= :local_number AND group_uuid IS NULL RETURNING *";
        if ($groupUUID != null) {
            $sql = "UPDATE webtexting_threads SET last_message = NOW() WHERE domain_uuid = :domain_uuid AND group_uuid = :group_uuid AND local_number= :local_number RETURNING *";
            $parameters['group_uuid'] = $groupUUID;
        } else {
            $parameters['remote_number'] = $remote_number;
        }
        $parameters['domain_uuid'] = $domainUUID;
        $parameters['local_number'] = $local_number;
        $thread = $db->select($sql, $parameters, 'row');
        if (!$thread) {
            $sql = "INSERT INTO webtexting_threads (domain_uuid, remote_number, local_number, last_message) VALUES (:domain_uuid, :remote_number, :local_number, NOW())";
            if ($groupUUID != null) {
                $sql = "INSERT INTO webtexting_threads (domain_uuid, group_uuid, local_number, last_message) VALUES (:domain_uuid, :group_uuid, :local_number, NOW())";
            }
            $db->execute($sql, $parameters);
        }
        unset($parameters);

        return $messageUUID;
    }///
    /* Update the delivery status of a message
     *
     * @param string $messageUUID   the UUID of the message to update
     * @param bool   $sentStatus    the new delivery status
     * @param string $extensionUUID the extension UUID associated with the message
     *
     * @return bool true on success, false on failure
     */
    public static function UpdateStatus(string $messageUUID, bool $sentStatus, string $extensionUUID)
    {
        $database = new database;
        $sql = "UPDATE webtexting_messages SET delivered = :delivered WHERE message_uuid = :message_uuid AND extension_uuid = :extension_uuid";
        $parameters['delivered'] = $sentStatus;
        $parameters['message_uuid'] = $messageUUID;
        $parameters['extension_uuid'] = $extensionUUID;
        if (!$database->execute($sql, $parameters)) {
            unset($parameters);
            return array(
                "error" => "failed to update sms destination",
                "messages" => $database->message,
                "statusCode" => 520,
            );
        }
        return array(
            "messages" => $database->message,
            "statusCode" => 200,
        );
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
            $displayName = $contact['contact_name_given'] . " " . $contact['contact_name_family'];
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
            switch ($key['setting']) {
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
                error_log("unknown error from push endpoint: " . $report->getReason() . "\n");
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
    
    private static function _sendSIP(string $domainName, string $extension, string $from, string $to, string $body, string $contentType, ?string $dedupeID, ?string $groupUUID=null, ?string $originalTo=null, bool $inbound=false)
    {
        $toAddress = $extension."@".$domainName;
        $fromAddress = $from."@".$domainName;

        $baseHeaders = array(
            "Event-Subclass"     => "SMS::SEND_MESSAGE",
            "proto"              => "sip",
            "from"               => "sip:".$from,
            "from_user"          => $from,
            "from_host"          => $domainName,
            "from_full"          => "sip:".$fromAddress,
            "to"                 => $toAddress,
            "to_user"            => $extension,
            "to_host"            => $domainName,
            "subject"            => "SIMPLE MESSAGE",
            "type"               => $contentType,
            "hint"               => "the hint",
            "DP_MATCH"           => $toAddress,
            "sip_h_X-Message-ID" => $dedupeID,
            "Content-Length"     => strlen($body),
        );

        if ($groupUUID != null) {
            $baseHeaders['sip_h_X-Group-ID'] = $groupUUID;
        }
        if ($originalTo != null) {
            $baseHeaders['sip_h_X-Original-To'] = $originalTo;
        }

        $destinations = array(
            array(
                "dest_proto"  => "sip",
                "sip_profile" => "websocket",
                "replying"    => "true",
            ),
        );

        // Only deliver to SIP device for inbound traffic (carrier → local user).
        // For outbound, the carrier API handles all delivery (including returning
        // the message if the destination is a local extension).
        if ($inbound) {
            $destinations[] = array(
                "dest_proto" => "GLOBAL_SMS",
                "context"    => "public",
                "inbound"    => "true",
            );
        }

        foreach ($destinations as $overrides) {
            $eventHeaders = array_merge($baseHeaders, $overrides);

            $cmd = "sendevent CUSTOM\n";
            foreach ($eventHeaders as $k => $v) {
                $cmd .= "$k: $v\n";
            }
            $cmd .= "\n".$body;

            event_socket_request_cmd($cmd);
        }
    }
}