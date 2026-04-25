<?php
declare(strict_types=1);

/**
 * This class implements encoding and decoding for Common Presence and Instant
 * Messaging (CPIM) messages. CPIM is described in RFC3862
 * (https://www.rfc-editor.org/rfc/rfc3862)
 */
final class CPIM
{
    public array $headers;
    public string $body = '';
    public string $filename;
    public int $fileSize;
    public $fileContentType;
    public $fileURL;

    /**
     * Construct a new CPIM
     */
    public function __construct()
    {
        $this->headers = array();
    }

    /**
     * Build a CPIM carrying an RCS file-transfer reference.
     *
     * @param string $filename         display name of the attachment
     * @param int    $fileSize         size of the attachment in bytes
     * @param string $fileContentType  MIME type of the attachment
     * @param string $fileURL          URL the receiving client will download from
     *
     * @return CPIM configured in file-transfer mode
     */
    public static function forFileTransfer(
        string $filename,
        int $fileSize,
        string $fileContentType,
        string $fileURL
    ): self {
        $cpim = new self();
        $cpim->filename = $filename;
        $cpim->fileSize = $fileSize;
        $cpim->fileContentType = $fileContentType;
        $cpim->fileURL = $fileURL;
        return $cpim;
    }

    /**
     * Build a CPIM carrying an inline text body.
     *
     * @param string $body plain text content
     *
     * @return CPIM configured in text-body mode
     */
    public static function forText(string $body): self
    {
        $cpim = new self();
        $cpim->body = $body;
        $cpim->headers['Content-Type'] = 'text/plain';
        return $cpim;
    }

    /**
     * Parse a block of encoded headers
     * 
     * @param string $headers a raw header string
     * 
     * @return null
     */
    private function _addHeaders(string $headers)
    {
        foreach (explode("\n", $headers) as $line) {
            $kv = explode(":", $line, 2);
            if (count($kv) != 2) {
                continue; // todo: figure out how to raise an error the php way
            }

            $key = strtolower($kv[0]);
            $value = trim($kv[1]);
            
            $this->headers[$key] = $value;
        }
    }

    /**
     * Parse a CPIM message string
     * 
     * @param string $raw the raw CPIM message
     * 
     * @return CPIM a CPIM object parsed from the input string
     */
    public static function fromString(string $raw): self
    {
        $message = new self();

        $parts = explode("\n\n", str_replace("\r\n", "\n", $raw));
        for($i = 0; $i < sizeof($parts)-1; $i++) {
            $message->_addHeaders($parts[$i]);
        }
        $rawBody = $parts[sizeof($parts)-1];
        $message->body = $rawBody;

        // Linphone emits bare `&` in URL attribute values (technically-invalid XML).
        // Pre-escape so xml_parse_into_struct can handle file-transfer payloads.
        // Negative lookahead skips already-escaped entities to avoid double-encoding.
        $rawBody = preg_replace(
            '/&(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/',
            '&amp;',
            $rawBody
        );

        $parser = xml_parser_create();
        xml_parse_into_struct($parser, $rawBody, $body);

        $message->fileURL = null;
        
        foreach ($body as $tag) {
            switch($tag['tag']) {
            case "FILE-SIZE":
                $message->fileSize = (int)$tag['value'];
                break;
            case "FILE-NAME":
                $message->filename = $tag['value'];
                break;
            case "CONTENT-TYPE":
                $message->fileContentType = $tag['value'];
                break;
            case "DATA":
                $message->fileURL = $tag['attributes']['URL'];
                break;
            }
        }

        return $message;
    }

    /**
     * Format this object into a CPIM string
     * 
     * @return string the CPIM object
     */
    public function toString(): string
    {
        if (isset($this->fileURL)) {
            $xw = xmlwriter_open_memory();
            xmlwriter_set_indent($xw, true);

            xmlwriter_start_document($xw, '1.0', 'UTF-8');

            xmlwriter_start_element($xw, 'file');

            xmlwriter_start_attribute($xw, 'xmlns');
            xmlwriter_text($xw, 'urn:gsma:params:xml:ns:rcs:rcs:fthttp');
            xmlwriter_end_attribute($xw);

            xmlwriter_start_attribute($xw, 'xmlns:am');
            xmlwriter_text($xw, 'urn:gsma:params:xml:ns:rcs:rcs:rram');
            xmlwriter_end_attribute($xw);

            xmlwriter_start_element($xw, 'file-info');
            xmlwriter_write_attribute($xw, 'type', 'file');

            if (isset($this->fileSize)) {
                xmlwriter_start_element($xw, 'file-size');
                xmlwriter_text($xw, (string)$this->fileSize);
                xmlwriter_end_element($xw);
            }

            if (isset($this->filename)) {
                xmlwriter_start_element($xw, 'file-name');
                xmlwriter_text($xw, $this->filename);
                xmlwriter_end_element($xw);
            }

            if (isset($this->fileContentType)) {
                xmlwriter_start_element($xw, 'content-type');
                xmlwriter_text($xw, $this->fileContentType);
                xmlwriter_end_element($xw);
            }

            xmlwriter_start_element($xw, 'data');
            xmlwriter_write_attribute($xw, 'url', $this->fileURL);
            xmlwriter_end_element($xw);

            xmlwriter_end_element($xw);  // close file-info

            xmlwriter_end_element($xw);  // close file

            $body = xmlwriter_output_memory($xw);
            $defaultContentType = 'application/vnd.gsma.rcs-ft-http+xml';
        } else {
            $body = $this->body;
            $defaultContentType = 'text/plain';
        }


        // Normalize content header keys to Linphone-compatible case (uppercase T/L).
        // Linphone's CPIM parser uses case-sensitive exact match for "Content-Type"
        // and "Content-Length" (see cpim-message.cpp getContentHeader lookup).
        foreach (['content-type' => 'Content-Type', 'content-length' => 'Content-Length', 'Content-type' => 'Content-Type', 'Content-length' => 'Content-Length'] as $variant => $proper) {
            if (array_key_exists($variant, $this->headers)) {
                $this->headers[$proper] = $this->headers[$variant];
                if ($variant !== $proper) {
                    unset($this->headers[$variant]);
                }
            }
        }

        if (!array_key_exists('Content-Length', $this->headers)) {
            $this->headers['Content-Length'] = strlen($body);
        }

        if (!array_key_exists('Content-Type', $this->headers)) {
            $this->headers['Content-Type'] = $defaultContentType;
        }

        $contentHeaders = array("Content-Type", "Content-Length");

        $firstHeaderBlock = array();
        foreach ($this->headers as $key=>$value) {
            if (in_array($key, $contentHeaders)) {
                continue;
            }

            $firstHeaderBlock[] = $key.": ".$value;
        }

        $secondHeaderBlock = array();
        foreach ($contentHeaders as $key) {
            if (!array_key_exists($key, $this->headers)) {
                continue;
            }

            $secondHeaderBlock[] = $key.": ".$this->headers[$key];
        }

        $out = implode("\r\n", $firstHeaderBlock)."\r\n\r\n".implode("\r\n", $secondHeaderBlock)."\r\n\r\n".$body;

        return $out;
    }

    /**
     * Get a list of other recipients
     * 
     * @return array additional recipients or empty array if not CC header present
     */
    public function getCC(): array
    {
        $val = $this->getHeader('cc');
        if ($val == null) {
            return array();
        }

        $recipients = array();
        foreach (explode(";", $val) as $recipient) {
            $start = strpos($recipient, '<')+1;
            $end = strpos($recipient, "@", $start);
            $recipients[] = substr($recipient, $start, $end-$start);
            error_log($recipient." (".$start."/".$end.")\n");
        }

        return $recipients;
    }

    /**
     * Get the value of a header
     * 
     * @param string $header the name of the header to lookup
     * 
     * @return string the value of the specified header, or null if absent
     */
    public function getHeader(string $header)
    {
        $header = strtolower($header);
        if (array_key_exists($header, $this->headers)) {
            return $this->headers[$header];
        }

        return null;
    }
}
