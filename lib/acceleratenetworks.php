<?php

function AccelerateNetworksGetAllInboundSMSRouting(): array {
    $ch = curl_init("https://sms.callpipe.com/client/all");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer '.$_SESSION['sms']['acceleratenetworks_secret_key']['text']]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $resp = json_decode(curl_exec($ch));
    curl_close($ch);

    return $resp;
}

function AccelerateNetworksRegisterInboundRouting(string $number) {
    $ch = curl_init("https://sms.callpipe.com/client/register");

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer '.$_SESSION['sms']['acceleratenetworks_secret_key']['text'],
        'Content-Type: application/json'
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(array(
        'dialedNumber' => $number,
        'callbackUrl' => "https://".$_SESSION['domain_name']."/app/sms/hook/sms_hook_acceleratenetworks.php",
        'clientSecret' => $_SESSION['sms']['acceleratenetworks_inbound_token']['text'],

    )));

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $resp = json_decode(curl_exec($ch));
    curl_close($ch);

    return $resp;
}
