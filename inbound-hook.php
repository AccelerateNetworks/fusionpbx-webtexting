<?php

function webtexting_sms_hook($to, $domain_uuid, $from, $body) {
    $payload['payload'] = array(
        "display_name" => "<".$from.">", // TODO: look up contact name
        "from" => $from,
        "to" => $to,
        "body" => $body
    );

    $sql = "SELECT webtexting_clients.* FROM webtexting_clients, webtexting_subscriptions, v_extensions WHERE ";
    $sql .= "v_extensions.extension = :extension AND v_extensions.domain_uuid = :domain_uuid AND ";
    $sql .= "webtexting_subscriptions.extension_uuid = v_extensions.extension_uuid AND ";
    $sql .= "(webtexting_subscriptions.remote_identifier = :remote_identifier or webtexting_subscriptions.remote_identifier IS NULL) AND ";
    $sql .= "webtexting_clients.client_uuid = webtexting_subscriptions.client_uuid";
    $parameters['extension'] = $to;
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['remote_identifier'] = $from;
    $database = new database;
    $targets = $database->select($sql, $parameters, 'all');
    unset($parameters);

    if (!$targets) {
        return;
    }

    $sql = "SELECT value FROM webtexting_settings WHERE setting = 'vapid_private_key'";
    $database = new database;
    $payload['vapid_private_key'] = $database->select($sql, null, 'column');
    unset($parameters);

    $payload['vapid_claims']['sub'] = "mailto:admin@example.com";

    foreach($targets as $target) {
        $payload['subscription'] = array(
            "endpoint" => $target['endpoint'],
            "keys" => array(
                "auth" => $target['auth'],
                "p256dh" => $target['p256dh']
            )
        );
        $ph = popen("/var/www/.local/share/virtualenvs/webtexting-LVtOi_dk/bin/python /var/www/fusionpbx/app/webtexting/push.py","w");
        fputs($ph, json_encode($payload)."\n");
        fclose($ph);
    }
    // echo json_encode($payload);
}
