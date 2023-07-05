<?php
require_once __DIR__."/../lib/acceleratenetworks.php";
$required_params = array("domain_uuid", "number", "extension_uuid");

function do_action($body) {
    error_log($body);

    $sql = "UPDATE v_extensions SET outbound_caller_id_number = :outbound_caller_id WHERE extension_uuid = :extension AND domain_uuid = :domain_uuid RETURNING extension";
    $parameters['outbound_caller_id'] = $body->number;
    $parameters['extension'] = $body->extension_uuid;
    $parameters['domain_uuid'] = $body->domain_uuid;
    $database = new database;
    $extension = $database->select($sql, $parameters, 'column');
    if(!$extension) {
        return array(
            "error" => "failed to update extension's outbound caller ID",
            "messages" => $database->message,
        );
    }
    unset($parameters);

    $sql = "SELECT sms_destination_uuid FROM v_sms_destinations WHERE destination = :number AND domain_uuid = :domain_uuid";
    $parameters['number'] = $body->number;
    $parameters['domain_uuid'] = $body->domain_uuid;
    $destination_uuid = $database->select($sql, $parameters, 'column');
    unset($parameters);
    if($destination_uuid) {
        $sql = "UPDATE v_sms_destinations SET enabled = true AND chatplan_detail_data = :extension WHERE domain_uuid = :domain_uuid AND sms_destination_uuid = :sms_destination_uuid";
        $parameters['extension'] = $extension;
        $parameters['domain_uuid'] = $body->domain_uuid;
        $parameters['sms_destination_uuid'] = $destination_uuid;
        if(!$database->execute($sql, $parameters)) {
            return array(
                "error" => "failed to update sms destination",
                "messages" => $database->message,
            );
        }
        unset($parameters);
    } else {
        $sql = "INSERT INTO v_sms_destinations (sms_destination_uuid, domain_uuid, destination, carrier, enabled, chatplan_detail_data) VALUES (:destination_uuid, :domain_uuid, :number, 'acceleratenetworks', true, :chatplan_detail_data)";
        $parameters['destination_uuid'] = uuid();
        $parameters['domain_uuid'] = $body->domain_uuid;
        $parameters['number'] = $body->number;
        $parameters['chatplan_detail_data'] = $extension;
        if(!$database->execute($sql, $parameters)) {
            return array(
                "error" => "failed to create sms destination",
                "messages" => $database->message,
            );
        }
        unset($parameters);
    }

    AccelerateNetworks::RegisterInboundRouting($body->number);

    return array("success" => true);
}
