<?php declare(strict_types=1);
use PHPUnit\Framework\TestCase;

final class CPIMTest extends TestCase
{
    public function testParseCPIM(): void
    {
        $string = "From: <sip:1002@acceleratenetworks.sip.callpipe.com>
To: <sip:1009@acceleratenetworks.sip.callpipe.com>
DateTime: 2023-05-10T22:48:05Z
NS: imdn <urn:ietf:params:imdn>
imdn.Message-ID: trpQpJEw9GKZ
imdn.Disposition-Notification: positive-delivery, negative-delivery, display

Content-Type: application/vnd.gsma.rcs-ft-http+xml
Content-Length: 408

<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<file xmlns=\"urn:gsma:params:xml:ns:rcs:rcs:fthttp\" xmlns:am=\"urn:gsma:params:xml:ns:rcs:rcs:rram\">
<file-info type=\"file\">
<file-size>286271</file-size>
<file-name>finn.png</file-name>
<content-type>image/png</content-type>
<data url=\"https://www.linphone.org:444//tmp/645c1f2741cff_dd766e8879da39b69c76.png\" until=\"2023-05-17T22:48:07Z\"/>
</file-info>
</file>";

        $cpim = CPIM::fromString($string);

        $this->assertSame("<sip:1002@acceleratenetworks.sip.callpipe.com>", $cpim->getHeader('from'));
        $this->assertSame("application/vnd.gsma.rcs-ft-http+xml", $cpim->getHeader('Content-Type'));
        $this->assertSame("https://www.linphone.org:444//tmp/645c1f2741cff_dd766e8879da39b69c76.png", $cpim->file_url);
        $this->assertSame("image/png", $cpim->file_content_type);
        $this->assertSame("finn.png", $cpim->file_name);
        $this->assertSame(286271, $cpim->file_size);
    }
}
