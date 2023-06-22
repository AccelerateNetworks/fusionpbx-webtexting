<?php
function store_message(string $direction, string $extension_uuid, string $domain_uuid, string $from, string $to, string $body, string $contentType, array $additionalRecipients)
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
    error_log("bumped thread: ".print_r($thread, true));
    if (!$thread) {
        $sql = "INSERT INTO webtexting_threads (domain_uuid, remote_number, local_number, last_message) VALUES (:domain_uuid, :from, :to, NOW())";
        if ($group_uuid != null) {
            $sql = "INSERT INTO webtexting_threads (domain_uuid, group_uuid, local_number, last_message) VALUES (:domain_uuid, :group_uuid, :to, NOW())";
        }
        $db->execute($sql, $parameters);
    }
    unset($parameters);
}
