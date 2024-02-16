<?php
require_once 'vendor/autoload.php';
use Minishlink\WebPush\VAPID;

require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";

header("Content-Type: application/json");

// for GET requests, just send back the public key
if($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT value FROM webtexting_settings WHERE setting = 'vapid_public_key'";
    $database = new database;
    $vapid_public_key = $database->select($sql, null, 'column');
    if(!$vapid_public_key) {
        $sql = "INSERT INTO webtexting_settings (setting, value) VALUES ('vapid_public_key', :vapid_public_key), ('vapid_private_key', :vapid_private_key)";
        $vapid_key = VAPID::createVapidKeys();
        $vapid_public_key = $vapid_key['publicKey'];
        $parameters['vapid_public_key'] = $vapid_key['publicKey'];
        $parameters['vapid_private_key'] = $vapid_key['privateKey'];
        $database->execute($sql, $parameters);
        unset($parameters);
    }

    echo json_encode(array("vapid_key" => $vapid_public_key));
    die();
}


$body = json_decode(file_get_contents('php://input'));

// get or generate subscription UUID
$sql = "SELECT client_uuid FROM webtexting_clients WHERE endpoint = :endpoint AND domain_uuid = :domain_uuid";
$parameters['endpoint'] = $body->endpoint->endpoint;
$parameters['domain_uuid'] = $domain_uuid;
$database = new database;
$client_uuid = $database->select($sql, $parameters, 'column');
unset($parameters);
if(!$client_uuid) {
    $client_uuid = uuid();
    $sql = "INSERT INTO webtexting_clients (client_uuid, domain_uuid, endpoint, auth, p256dh) VALUES (:client_uuid, :domain_uuid, :endpoint, :auth, :p256dh)";
    $parameters['client_uuid'] = $client_uuid;
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['endpoint'] = $body->endpoint->endpoint;
    $parameters['auth'] = $body->endpoint->keys->auth;
    $parameters['p256dh'] = $body->endpoint->keys->p256dh;
    $database = new database;
    $database->execute($sql, $parameters);
    error_log("inserting into webtexting_clients: ".json_encode($parameters));
    unset($parameters);
}

$sql = "SELECT * FROM webtexting_subscriptions WHERE client_uuid = :client_uuid AND domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid AND ";
$parameters['client_uuid'] = $client_uuid;
$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $body->extension_uuid;
if($body->remote_identifier) {
    $sql .= "(remote_identifier = :remote_identifier OR remote_identifier IS NULL)";
    $parameters['remote_identifier'] = $body->remote_identifier;
} else {
    $sql .= "remote_identifier IS NULL";
}
$database = new database;
$subscriptions = $database->select($sql, $parameters, 'all');
unset($parameters);

$notification_state = "off";
foreach($subscriptions as $subscription) {
    if($subscription['remote_identifier']) {
        if($notification_state == "off") {
            $notification_state = "on";
        }
    } else {
        $notification_state = "all";
    }
}

if($body->{'state'} == "on" && !$subscriptions) { // enabled notifications
    $sql = "INSERT INTO webtexting_subscriptions (subscription_uuid, domain_uuid, client_uuid, extension_uuid, remote_identifier) VALUES (:subscription_uuid, :domain_uuid, :client_uuid, :extension_uuid, :remote_identifier) RETURNING *";
    $parameters['subscription_uuid'] = uuid();
    $parameters['client_uuid'] = $client_uuid;
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['extension_uuid'] = $body->{'extension_uuid'};
    $parameters['remote_identifier'] = $body->{'remote_identifier'};
    $database = new database;
    $subscriptions = $database->select($sql, $parameters, 'row');
    unset($parameters);
    $notification_state = "all";
    if($body->{'remote_identifier'}) {
        $notification_state = "on";
    }
} elseif($body->{'state'} == "off" && $subscriptions) { // disable notifications
    $sql = "DELETE FROM webtexting_subscriptions WHERE client_uuid = :client_uuid AND domain_uuid = :domain_uuid";
    $parameters['client_uuid'] = $client_uuid;
    $parameters['domain_uuid'] = $domain_uuid;
    if($body->{'remote_identifier'}) {
        $sql .= " AND remote_identifier = :remote_identifier";
        $parameters['remote_identifier'] = null;
    }
    $database = new database;
    $database->execute($sql, $parameters);
    unset($parameters);

    $notification_state = "off";
}

echo json_encode(array("state" => $notification_state));
