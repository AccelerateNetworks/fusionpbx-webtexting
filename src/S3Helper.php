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

    public static function GetDownloadURL(string $url): string
    {
        $s3 = S3Helper::_getS3Client();
        $cmd = $s3->getCommand(
            'GetObject', [
                'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
                'Key' => S3Helper::_extractKey($url),
            ]
        );

        $request = $s3->createPresignedRequest($cmd, '+1 day');

        return $request->getUri();
    }

    public static function GetInfo(string $url)
    {
        return S3Helper::_getS3Client()->HeadObject(
            [
                'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
                'Key' => S3Helper::_extractKey($url),
            ]
        );
    }

    public static function Download(string $url): string
    {
        $result = S3Helper::_getS3Client()->getObject(
            [
                'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
                'Key' => S3Helper::_extractKey($url),
            ]
        );

        return (string)$result['Body'];
    }

    public static function GetUploadURL(string $uploadPath): string
    {
        $s3 = S3Helper::_getS3Client();
        $cmd = $s3->getCommand('PutObject', [
            'Bucket' => $_SESSION['webtexting']['mms_bucket']['text'],
            'Key' => $uploadPath,
        ]);
        $testbucketeer = $_SESSION['webtexting']['mms_bucket']['text'];
        $testKEY = $uploadPath;
        $request = $s3->createPresignedRequest($cmd, '+1 hour');

        return $request->getUri();
    }

    public static function UploadFile(string $key, string $filePath, string $contentType): string
    {
        $s3 = S3Helper::_getS3Client();
        $s3->putObject([
            'Bucket'      => $_SESSION['webtexting']['mms_bucket']['text'],
            'Key'         => $key,
            'SourceFile'  => $filePath,
            'ContentType' => $contentType,
        ]);
        return $_SESSION['webtexting']['mms_bucket_endpoint']['text']
            . "/" . $_SESSION['webtexting']['mms_bucket']['text']
            . "/" . $key;
    }

    /**
     * Return the canonical path-style unsigned URL for the object referenced by $url.
     * Idempotent — already-canonical URLs pass through unchanged.
     */
    public static function canonicalize(string $url): string
    {
        $key = S3Helper::_extractKey($url);
        return $_SESSION['webtexting']['mms_bucket_endpoint']['text']
            . '/' . $_SESSION['webtexting']['mms_bucket']['text']
            . '/' . $key;
    }

    /**
     * Extract an S3 object key from any URL shape we might encounter.
     * Handles:
     *   - path-style:          https://<endpoint-host>/<bucket>/<key>[?query]
     *   - virtual-hosted-style: https://<bucket>.<endpoint-host>/<key>[?query]
     * Signed URLs (with X-Amz-... query params) are accepted — the query string
     * is stripped before extraction.
     */
    private static function _extractKey(string $url): string
    {
        $endpoint = $_SESSION['webtexting']['mms_bucket_endpoint']['text'];
        $bucket   = $_SESSION['webtexting']['mms_bucket']['text'];

        $pathOnly = explode('?', $url, 2)[0];

        $pathPrefix = $endpoint . '/' . $bucket . '/';
        if (strncmp($pathOnly, $pathPrefix, strlen($pathPrefix)) === 0) {
            return substr($pathOnly, strlen($pathPrefix));
        }

        $parts = parse_url($endpoint);
        if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
            throw new \InvalidArgumentException("mms_bucket_endpoint is not a valid URL: {$endpoint}");
        }
        $vhPrefix = $parts['scheme'] . '://' . $bucket . '.' . $parts['host'] . '/';
        if (strncmp($pathOnly, $vhPrefix, strlen($vhPrefix)) === 0) {
            return substr($pathOnly, strlen($vhPrefix));
        }

        throw new \InvalidArgumentException(
            "URL doesn't match path-style or virtual-hosted for bucket '{$bucket}': {$url}"
        );
    }
}
