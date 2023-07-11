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
    case "sms_enable":
        $sql = "UPDATE webtexting_destinations SET phone_number = :phone_number WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid RETURNING *";
        $parameters['phone_number'] = $_POST['phone_number'];
        $parameters['extension_uuid'] = $_POST['extension_uuid'];
        $parameters['domain_uuid'] = $domain_uuid;
        if($database->select($sql, $parameters, 'row')) {
            message::add("updated SMS for extension with number ".$_POST['phone_number']);
        } else {
            $sql = "INSERT INTO webtexting_destinations (phone_number, extension_uuid, domain_uuid) VALUES (:phone_number, :extension_uuid, :domain_uuid)";
            if($database->execute($sql, $parameters)) {
                message::add("enabled SMS for extension with number ".$_POST['phone_number']);
            } else {
                message::add("error updating SMS destination chatplan detail data ".$_POST['phone_number'], 'negative');
            }
        }
        unset($parameters);
        break;
    case "sms_disable":
        $sql = "DELETE FROM webtexting_destinations WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid";
        $parameters['extension_uuid'] = $_POST['extension_uuid'];
        $parameters['domain_uuid'] = $domain_uuid;
        if($database->execute($sql, $parameters)) {
            message::add("disabled SMS for extension");
        } else {
            message::add("error disabling SMS", 'negative');
        }
        unset($parameters);
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

function fixbutton(array $params, $label="update") {
    $out = "<form method='post'>";
    foreach($params as $k=>$v) {
        $opts = $v;
        if (is_string($v)) {
            $opts = [
                "type" => "hidden",
                "value" => $v,
            ];
        }

        $u = uuid();

        if($opts['type'] != "hidden") {
            $out .= "<label for='".$u."'>".$k.": ";
        }

        $out .= "<input type='".$opts['type']."' name='".$k."' value='".$opts['value']."' id='".$u."' />";

        if($opts['type'] != "hidden") {
            $out .= "</label><br />";
        }
    }
    $out .= "<input type='submit' class='btn' value='".$label."' />";
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
    $sms_number = $extension['outbound_caller_id_number'];
    if($smsenabled_extensions[$extension['extension_uuid']]) {
        $sms_number = $smsenabled_extensions[$extension['extension_uuid']]['phone_number'];
        echo "<td class='success'>";
    } else {
        echo "<td>";
    }
    echo fixbutton(
        [
            'fix' => 'sms_enable',
            'extension_uuid' => $extension['extension_uuid'],
            'phone_number' => [
                'type' => 'text',
                'value' => $sms_number,
            ],
        ]
    );

    if($smsenabled_extensions[$extension['extension_uuid']]) {
        echo "<br />";
        echo fixbutton(['fix' => 'sms_disable', 'extension_uuid' => $extension['extension_uuid']], "disable SMS");
    }
    echo "</td>";

    if($smsenabled_extensions[$extension['extension_uuid']]) {
        $problems = array();

        try {
            $inboundRouting = AccelerateNetworks::GetInboundSMSRouting($sms_number);

            if($inboundRouting->callbackUrl != $desiredWebhookURL) {
                $problems[] = "webhook URL is wrong: <code>".$inboundRouting->callbackUrl."</code> should be <code>".$desiredWebhookURL."</code>";
            }

            if ($inboundRouting->clientSecret != $_SESSION['webtexting']['acceleratenetworks_inbound_token']['text']) {
                $problems[] = "client secret incorrect";
            }

            if ($inboundRouting->asDialed != $sms_number) {
                $problems[] = "number formatting disagreement. theirs: ".$inboundRouting->asDialed." ours: ".$sms_number;
            }
        } catch(GuzzleHttp\Exception\ClientException $e) {
            $problems[] = GuzzleHttp\Psr7\Message::toString($e->getResponse());
        }

        if(count($problems) > 0) {
            echo "<td class='error'><ul>";
            foreach($problems as $problem) {
                echo "<li>".$problem."</li>";
            }
            echo "</ul>";
        } else {
            echo "<td class='success'>configured<br />";
        }

        echo fixbutton(['fix' => 'inbound_webhook_url', 'number' => $sms_number]);
        echo "</td>";
    } else {
        echo "<td>not routed</td>";
    }

    unset($sms_number);
    echo "</tr>";
}

echo "</table>";

require "footer.php";
