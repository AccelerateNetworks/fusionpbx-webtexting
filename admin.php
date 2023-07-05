<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";
require_once __DIR__."/vendor/autoload.php";

if(!if_group('superadmin')) {
    echo "access denied";
    require "footer.php";
    die();
}


$desiredWebhookURL = "https://".$_SESSION['domain_name']."/app/webtexting/inbound-hook.php?provider=accelerate-networks";

$database = new database;

switch($_POST['fix']) {
    case "inbound_webhook_url":
        AccelerateNetworks::RegisterInboundRouting($_POST['number'], $desiredWebhookURL);
        message::add("added SMS destination for ".$_POST['number']);
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

function fixbutton(array $params) {
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

$sql = "SELECT extension_uuid, phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid";
$parameters['domain_uuid'] = $domain_uuid;
foreach($database->select($sql, $parameters, 'all') as $d) {
    $smsenabled_extensions[$d['extension_uuid']] = $d;
}
unset($parameters);

echo "<table class='table'>\n";
echo "<tr>";
echo "<th>Extension</th>";
echo "<th>SMS-enabled</th>";
echo "<th>Upstream Inbound Routing</th>";
echo "</tr>";
foreach($extensions as $extension) {
    echo "<tr>";    
    echo "<td>".$extension['extension']."</td>";
    if($smsenabled_extensions[$extension['extension_uuid']]) {
        $sms_number = $smsenabled_extensions[$extension['extension_uuid']]['phone_number'];
        echo "<td class='success'>".$sms_number."</td>";
    } else {
        echo "<td>no</td>";
    }

    if($sms_number) {
        $inboundRouting = AccelerateNetworks::GetInboundSMSRouting($sms_number);
        $problems = array();

        if($inboundRouting->callbackUrl != $desiredWebhookURL) {
            $problems[] = "webhook URL is wrong: <code>".$inboundRouting->callbackUrl."</code> should be <code>".$desiredWebhookURL."</code>";
        }

        if ($inboundRouting->clientSecret != $_SESSION['webtexting']['acceleratenetworks_inbound_token']['text']) {
            $problems[] = "client secret incorrect";
        }

        if(count($problems) > 0) {
            echo "<td class='error'><ul>";
            foreach($problems as $problem) {
                echo "<li>".$problem."</li>";
            }
            echo "</ul>";
            echo fixbutton(['fix' => 'inbound_webhook_url', 'number' => $sms_number]);
            echo "</td>";
        } else {
            echo "<td class='success'>configured</td>";
        }
    } else {
        echo "<td>not routed</td>";
    }

    unset($sms_number);
    echo "</tr>";
}

echo "</table>";

require "footer.php";
