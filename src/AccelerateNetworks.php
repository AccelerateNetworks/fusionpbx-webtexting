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
        //ValidateAccessToken()
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

    //This function hits toms ops.callpipe.com for verifying auth
    static function ValidateAccessToken(){
        //Pre-Conditions
        if(isset($_SESSION['webtexting']['acceleratenetworks_api_key']['text'])){
            //if accesstoken is set check if expired
            //if accessToken is set we've also set the other relevant session variables
            if($_SESSION['webtexting']['auth']['accessTokenExpiration'] < (time()-120)){
                //token is expired hit /refresh
                $client = new GuzzleHttp\Client();
                $res = $client->request(
                    'POST', "https://sms.callpipe.com/refresh",[           
                    'json' => [
                        'refreshToken' => $_SESSION['webtexting']['auth']['refreshToken'],
                    ],
                    ]
                );                
                if($res->getStatusCode() == '200'){
                    $responseBody = json_decode($res->getBody()->getContents());
                    $_SESSION['webtexting']['acceleratenetworks_api_key']['text'] = $responseBody->accessToken;
                    $_SESSION['webtexting']['auth']['accessTokenExpiration'] = time() + $responseBody->expiresIn;
                    $_SESSION['webtexting']['auth']['refreshToken'] = $responseBody->refreshToken;
                }
                else{
                    //refresh failed. try /login
                    $client = new GuzzleHttp\Client();
                    $res = $client->request(
                        'POST', "https://sms.callpipe.com/login",[           
                            'json' => [
                                //these are set at 
                                'email' => $_SESSION['webtexting']['auth']['email'],
                                'password' => $_SESSION['webtexting']['auth']['secret'],
                            ],
                        ]
                    );
                    $responseBody = json_decode($res->getBody()->getContents());
                    //the
                    $_SESSION['webtexting']['acceleratenetworks_api_key']['text'] = $responseBody->accessToken;
                    $_SESSION['webtexting']['auth']['accessTokenExpiration'] = time() + $responseBody->expiresIn;
                    $_SESSION['webtexting']['auth']['refreshToken'] = $responseBody->refreshToken;
                }
                
            }
            else{
                //token is not expired do nothing
            }
        }
        else{
            //hit /login
                $client = new GuzzleHttp\Client();
                $res = $client->request(
                    'POST', "https://sms.callpipe.com/login",[           
                        'json' => [
                            'email' => $_SESSION['webtexting']['auth']['email'],
                            'password' => $_SESSION['webtexting']['auth']['secret'],
                        ],
                    ]
                );
                if($res->getStatusCode() =='200'){
                    $responseBody = json_decode($res->getBody()->getContents());
                    $_SESSION['webtexting']['acceleratenetworks_api_key']['text'] = $responseBody->accessToken;
                    $_SESSION['webtexting']['auth']['accessTokenExpiration'] = time() + $responseBody->expiresIn;
                    $_SESSION['webtexting']['auth']['refreshToken'] = $responseBody->refreshToken;
                }
                else{
                    echo "<script>alert('Invalid Credentials: Contact support@acceleratenetworks.com');</script>";
                } 
              
        }
    }

}
