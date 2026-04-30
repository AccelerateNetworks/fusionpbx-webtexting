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
CC: <2024561414@acceleratenetworks.sip.callpipe.com>; <2065551212@acceleratenetworks.sip.callpipe.com>
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
        $this->assertSame("https://www.linphone.org:444//tmp/645c1f2741cff_dd766e8879da39b69c76.png", $cpim->fileURL);
        $this->assertSame("image/png", $cpim->fileContentType);
        $this->assertSame("finn.png", $cpim->filename);
        $this->assertSame(286271, $cpim->fileSize);

        $this->assertSame(array("2024561414", "2065551212"), $cpim->getCC());
    }

    public function testGenerateCPIM(): void
    {
        $cpim = CPIM::forFileTransfer(
            "finn.png",
            286271,
            "image/png",
            "https://www.linphone.org:444//tmp/645c1f2741cff_dd766e8879da39b69c76.png"
        );
        $cpim->headers['From'] = "<sip:1002@acceleratenetworks.sip.callpipe.com>";
        $cpim->headers['To'] = "<sip:1009@acceleratenetworks.sip.callpipe.com>";
        $cpim->headers['DateTime'] = "2023-05-10T22:48:05Z";
        $cpim->headers['NS'] = "imdn <urn:ietf:params:imdn>";
        $cpim->headers['imdn.Message-ID'] = "trpQpJEw9GKZ";
        $cpim->headers['imdn.Disposition-Notification'] = "positive-delivery, negative-delivery, display";

        $string = "From: <sip:1002@acceleratenetworks.sip.callpipe.com>\r\n" .
            "To: <sip:1009@acceleratenetworks.sip.callpipe.com>\r\n" .
            "DateTime: 2023-05-10T22:48:05Z\r\n" .
            "NS: imdn <urn:ietf:params:imdn>\r\n" .
            "imdn.Message-ID: trpQpJEw9GKZ\r\n" .
            "imdn.Disposition-Notification: positive-delivery, negative-delivery, display\r\n" .
            "\r\n" .
            "Content-Type: application/vnd.gsma.rcs-ft-http+xml\r\n" .
            "Content-Length: 382\r\n" .
            "\r\n" .
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" .
            "<file xmlns=\"urn:gsma:params:xml:ns:rcs:rcs:fthttp\" xmlns:am=\"urn:gsma:params:xml:ns:rcs:rcs:rram\">\n" .
            " <file-info type=\"file\">\n" .
            "  <file-size>286271</file-size>\n" .
            "  <file-name>finn.png</file-name>\n" .
            "  <content-type>image/png</content-type>\n" .
            "  <data url=\"https://www.linphone.org:444//tmp/645c1f2741cff_dd766e8879da39b69c76.png\"/>\n" .
            " </file-info>\n" .
            "</file>\n";
        $this->assertSame($string, $cpim->toString());
    }

    public function testForFileTransferFactory(): void
    {
        $cpim = CPIM::forFileTransfer("video.mp4", 632327, "video/mp4", "https://example.com/video.mp4");

        $this->assertSame("video.mp4", $cpim->filename);
        $this->assertSame(632327, $cpim->fileSize);
        $this->assertSame("video/mp4", $cpim->fileContentType);
        $this->assertSame("https://example.com/video.mp4", $cpim->fileURL);
        $this->assertSame("", $cpim->body);
    }

    public function testForTextFactory(): void
    {
        $cpim = CPIM::forText("Hello, Kenny");

        $this->assertSame("Hello, Kenny", $cpim->body);
        $this->assertSame("text/plain", $cpim->headers['Content-Type']);
        $this->assertFalse(isset($cpim->fileURL));
        $this->assertFalse(isset($cpim->filename));

        $cpim->headers['From'] = "<sip:18183378899@kenny.sip.callpipe.com>";
        $cpim->headers['To'] = "<sip:10@kenny.sip.callpipe.com>";
        $cpim->headers['DateTime'] = "2026-04-22T05:09:43Z";

        $expected = "From: <sip:18183378899@kenny.sip.callpipe.com>\r\n" .
            "To: <sip:10@kenny.sip.callpipe.com>\r\n" .
            "DateTime: 2026-04-22T05:09:43Z\r\n" .
            "\r\n" .
            "Content-Type: text/plain\r\n" .
            "Content-Length: 12\r\n" .
            "\r\n" .
            "Hello, Kenny";

        $this->assertSame($expected, $cpim->toString());
    }
}
