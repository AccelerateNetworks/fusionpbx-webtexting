<?php

function webtexting_sms_hook($to, $domain_uuid, $from, $body)
{
    $payload['payload'] = array(
        "display_name" => "<" . $from . ">",
        // TODO: look up contact name
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

    foreach ($targets as $target) {
        $payload['subscriptions'][] = array(
            "endpoint" => $target['endpoint'],
            "keys" => array(
                "auth" => $target['auth'],
                "p256dh" => $target['p256dh']
            )
        );
    }

    $descriptorspec = array(
        0 => array("pipe", "r"), // stdin is a pipe that the child will read from
        1 => array("pipe", "w"), // stdout is a pipe that the child will write to
        2 => array("pipe", "w"), // stderr is a file to write to
    );

    $wd = dirname(__FILE__);
    $cmd = "$(pipenv --py) push.py"; // woah this is janky, pipenv run python push.py was complaining
    echo "executing $cmd in $wd\n";
    $process = proc_open($cmd, $descriptorspec, $pipes, $wd);

    fputs($pipes[0], json_encode($payload) . "\n");
    fclose($pipes[0]);

    $stdout = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[2]);

    $return_value = proc_close($process);
    if($return_value != 0) {
        error_log("\npush.py exited uncleanly with status ".$return_value." stderr: ".$stderr);
        return;
    }

    foreach(json_decode($stdout) as $result) {
        if(!$result->success) {
            if($result->error->code != 410) {
                error_log("unknown error from push endpoint: ".json_encode($result->error));
                continue;
            }

            error_log("410 Gone from push endpoint, deleting subscription from database");

            $sql = "DELETE FROM webtexting_subscriptions USING webtexting_clients WHERE webtexting_subscriptions.client_uuid = webtexting_clients.client_uuid AND webtexting_clients.endpoint = :endpoint";
            $parameters['endpoint'] = $result->subscription->endpoint;
            $database = new database;
            $database->execute($sql, $parameters);

            $sql = "DELETE FROM webtexting_clients WHERE endpoint = :endpoint";
            $database = new database;
            $database->execute($sql, $parameters);

            unset($parameters);
        }
    }
}
