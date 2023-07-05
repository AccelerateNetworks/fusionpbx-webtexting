<?php

final class AccelerateNetworks {
    static function GetInboundSMSRouting(string $number) {
        $client = new GuzzleHttp\Client();
        $res = $client->request(
            'GET', "https://sms.callpipe.com/client?asDialed=".urlencode($number), [
                'headers' => [
                    'Authorization' => "Bearer ".$_SESSION['webtexting']['acceleratenetworks_api_key']['text'],
                ],
            ],
        );
    
        return json_decode($res->getBody()->getContents());
    }

    static function RegisterInboundRouting(string $number, string $url) {
        $client = new GuzzleHttp\Client();
        $res = $client->request(
            'POST', "https://sms.callpipe.com/client/register", [
                'headers' => [
                    'Authorization' => "Bearer ".$_SESSION['webtexting']['acceleratenetworks_api_key']['text'],
                ],
                'http_errors' => false,
                'json' => [
                    'dialedNumber' => $number,
                    'callbackUrl' => $url,
                    'clientSecret' => $_SESSION['sms']['acceleratenetworks_inbound_token']['text'],
                ],
            ],
        );
    
        return json_decode($res->getBody()->getContents());
    }

}
