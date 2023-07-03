<?php
use GuzzleHttp\Promise\Create;
use GuzzleHttp\Promise\RejectedPromise;
use Aws\Credentials\Credentials;
use Aws\Exception\CredentialsException;

class S3Helper
{
    private static function _credentials()
    {
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
    
    private static function _getS3Client(): Aws\S3\S3Client
    {
        return new Aws\S3\S3Client(
            [
                'version' => 'latest',
                'region'  => 'us-east-1',
                'use_path_style_endpoint' => false,
                'endpoint' => $_SESSION['webtexting']['mms_bucket_endpoint']['text'],
                'credentials' => S3Helper::_credentials(),
            ]
        );
    }

    public static function GetDownloadURL(string $unsigned): string
    {
        $prefix = $_SESSION['webtexting']['mms_bucket_endpoint']['text']."/".$_SESSION['webtexting']['mms_bucket']['text']."/";
        $objectKey = substr($unsigned, strlen($prefix));

        $s3 = S3Helper::_getS3Client();
        $cmd = $s3->getCommand(
            'GetObject', [
                'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
                'Key' => $objectKey,
            ]
        );

        $request = $s3->createPresignedRequest($cmd, '+1 day');
        
        return $request->getUri();
    }

    public static function GetInfo(string $url)
    {
        $prefix = $_SESSION['webtexting']['mms_bucket_endpoint']['text']."/".$_SESSION['webtexting']['mms_bucket']['text']."/";
        $objectKey = substr($url, strlen($prefix));

        return S3Helper::_getS3Client()->HeadObject(
            [
                'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
                'Key' => $objectKey,
            ]
        );
    }
}
