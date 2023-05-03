<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";
require_once __DIR__."/lib/acceleratenetworks.php";

if(!if_group('superadmin')) {
    echo "access denied";
    require "footer.php";
    die();
}

$database = new database;

switch($_POST['fix']) {
    case "outbound_caller_id":
        $sql = "UPDATE v_extensions SET outbound_caller_id_number = :outbound_caller_id WHERE extension_uuid = :extension AND domain_uuid = :domain_uuid";
        $parameters['outbound_caller_id'] = $_POST['outbound_caller_id'];
        $parameters['extension'] = $_POST['extension'];
        $parameters['domain_uuid'] = $domain_uuid;
        if($database->execute($sql, $parameters)) {
            message::add("updated outbound caller ID for extension ".$_POST['extension']);
        } else {
            message::add("error updating outbound caller ID for extension ".$_POST['extension'], 'negative');
        }
        unset($parameters);
        break;
    case "update_sms_destination":
        $sql = "UPDATE v_sms_destinations SET chatplan_detail_data = :chatplan_detail_data WHERE sms_destination_uuid = :destination AND domain_uuid = :domain_uuid";
        $parameters['chatplan_detail_data'] = $_POST['chatplan_detail_data'];
        $parameters['destination'] = $_POST['destination'];
        $parameters['domain_uuid'] = $domain_uuid;
        if($database->execute($sql, $parameters)) {
            message::add("updated SMS destination chatplan detail data ".$_POST['destination']);
        } else {
            message::add("error updating SMS destination chatplan detail data ".$_POST['destination'], 'negative');
        }
        unset($parameters);
        break;
    case "create_sms_destination":
        $sql = "INSERT INTO v_sms_destinations (sms_destination_uuid, domain_uuid, destination, carrier, enabled, chatplan_detail_data) VALUES (:sms_destination_uuid, :domain_uuid, :number, 'acceleratenetworks', true, :chatplan_detail_data)";
        $parameters['sms_destination_uuid'] = uuid();
        $parameters['domain_uuid'] = $domain_uuid;
        $parameters['number'] = $_POST['number'];
        $parameters['chatplan_detail_data'] = $_POST['chatplan_detail_data'];
        if($database->execute($sql, $parameters)) {
            message::add("added SMS destination for ".$_POST['number']);
        } else {
            message::add("error adding SMS destination for ".$_POST['number'], 'negative');
        }
        unset($parameters);
        break;
    case "upstream_routing":
        AccelerateNetworksRegisterInboundRouting($_POST['number']);
        break;
    default:
        if($_POST['fix']) {
            message::add("unknown fix: ".$_POST['fix'], 'negative');
        }
        break;
}

?>
<style type="text/css">
    .error {
        background-color: #fcc;
    }

    .success {
        background-color: #cfc;
    }
</style>
<?php

function fixbutton(string $message, array $params) {
    $out = "<form method='post'>";
    foreach($params as $k=>$v) {
        $out .= "<input type='hidden' name='".$k."' value='".$v."' />";
    }
    $out .= $message.": <input type='submit' class='btn' value='fix' />";
    $out .= "</form>";
    return $out;
}


echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting Administration</b></div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";

$sql = "SELECT * FROM v_extensions WHERE domain_uuid = :domain_uuid";
$parameters['domain_uuid'] = $domain_uuid;
$extensions = $database->select($sql, $parameters, 'all');
unset($parameters);

$sql = "SELECT * FROM v_sms_destinations WHERE domain_uuid = :domain_uuid";
$parameters['domain_uuid'] = $domain_uuid;
foreach($database->select($sql, $parameters, 'all') as $d) {
    $sms_destinations[$d['destination']] = $d;
}
unset($parameters);

foreach(AccelerateNetworksGetAllInboundSMSRouting() as $d) {
    $number = $d->asDialed;
    $sms_destinations[$number]['messaging_data'] = $d;
}

echo "<table class='table'>\n";
echo "<tr>";
echo "<th>Extension</th>";
echo "<th>Outbound Routing (Outbound Caller ID)</th>";
echo "<th>Outbound Routing</th>";
echo "<th>Upstream Inbound Routing</th>";
echo "</tr>";
foreach($extensions as $extension) {
    $number = $extension['outbound_caller_id_number'];
    $trimmed_number = ltrim($number, "+1"); // trim any leading + or 1 characters
    echo "<tr>";    
    echo "<td>".$extension['extension']."</td>";
    if($number == "") {
        echo "<td class='error'>no outbound caller ID set</td>";
    } else if($number == $trimmed_number) {
        echo "<td class='success'>".$number."</td>";
    } else {
        $fix = array(
            'fix' => 'outbound_caller_id',
            'extension' => $extension['extension_uuid'],
            'outbound_caller_id' => $trimmed_number,
        );
        echo "<td class='error'>".fixbutton($number." -> ".$trimmed_number, $fix)."</td>";
    }

    $sms_destination = $sms_destinations[$trimmed_number];
    if($sms_destination && $sms_destination['sms_destination_uuid']) {
        $destination_extenion = $sms_destination['chatplan_detail_data'];
        if($destination_extenion == $extension['extension']) {
            echo "<td class='success'>".$trimmed_number." -> ".$destination_extenion."</td>";
        } else {
            $fix = array(
                'fix' => 'update_sms_destination',
                'destination' => $sms_destination['sms_destination_uuid'],
                'chatplan_detail_data' => $extension['extension'],
            );
            echo "<td class='error'>".fixbutton("SMS routes to wrong extension: ".$trimmed_number." -> ".$destination_extenion, $fix)."</td>";
        }
    } else if($trimmed_number) {
        $fix = array(
            'fix' => 'create_sms_destination',
            'number' => $trimmed_number,
            'chatplan_detail_data' => $extension['extension'],
        );
        echo "<td class='error'>".fixbutton("no SMS destination for ".$trimmed_number, $fix)."</td>";
    } else {
        echo "<td>-</td>";
    }

    $fix = array(
        'fix' => 'upstream_routing',
        'number' => $trimmed_number,
    );
    if($trimmed_number != "" && $sms_destination['messaging_data']) {
        $actualUrl = $sms_destination['messaging_data']->callbackUrl;
        $desiredUrl = "https://".$_SESSION['domain_name']."/app/sms/hook/sms_hook_acceleratenetworks.php";

        if($actualUrl != $desiredUrl) {
            $errors[] = "callback URL incorrect: ".$actualUrl." -> ".$desiredUrl;
        }

        $actualToken = $sms_destination['messaging_data']->clientSecret;
        $desiredToken = $_SESSION['sms']['acceleratenetworks_inbound_token']['text'];
        if($actualToken != $desiredToken) {
            $errors[] = "token incorrect: ".$actualToken." -> ".$desiredToken;
        }

        if(sizeof($errors) > 0) {
            echo "<td class='error'><ul>";
            foreach($errors as $error) {
                echo "<li>".$error."</li>";
            }
            echo "</ul>";
            echo fixbutton("upstream routing", $fix);
            echo "</td>";
        } else {
            echo "<td class='success'>inbound SMS routed correctly</td>";
        }
        unset($errors);
    } else {
        echo "<td class='error'>".fixbutton("number not routed upstream", $fix)."</td>";
    }
    echo "</tr>";
}

echo "</table>";

require "footer.php";
