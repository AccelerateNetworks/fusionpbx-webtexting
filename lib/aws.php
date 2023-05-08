<?php

use GuzzleHttp\Promise\Create;
use GuzzleHttp\Promise\RejectedPromise;
use Aws\Credentials\Credentials;
use Aws\Exception\CredentialsException;

// based on https://docs.aws.amazon.com/sdk-for-php/v3/developer-guide/guide_credentials_provider.html
function DigitalOceanSpacesCredentials() {
    return function () {
        $key = $_SESSION['webtexting']['aws_access_key_id']['text'];
        $secret = $_SESSION['webtexting']['aws_secret_key']['text'];
        if ($key && $secret) {
            return Create::promiseFor(new Credentials($key, $secret, null));
        }


        $msg = 'S3 credentials not in FusionPBX settings';
        return new RejectedPromise(new CredentialsException($msg));
    };
}

