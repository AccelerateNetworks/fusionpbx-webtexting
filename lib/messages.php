<?php
function store_message(string $direction, string $extension_uuid, string $domain_uuid, string $from, string $to, string $body, string $contentType, array $additionalRecipients) {
    $db = new database;

    // save the message to the db
    $sql = "INSERT INTO webtexting_messages (message_uuid, extension_uuid, domain_uuid, start_stamp, from_number, to_number, message, direction) VALUES (:message_uuid, :extension_uuid, :domain_uuid, NOW(), :from, :to, :body, :direction)";
    $parameters['message_uuid'] = uuid();
    $parameters['extension_uuid'] = $extension_uuid;
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['from'] = $from;
    $parameters['to'] = $to;
    $parameters['body'] = $body;
    $parameters['direction'] = $direction;
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
}
