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

        $parts = explode("\n\n", $raw);
        for($i = 0; $i < sizeof($parts)-2; $i++) {
            $message->_addHeaders($parts[$i]);
        }
        $rawBody = $parts[sizeof($parts)-1];
    
        $parser = xml_parser_create();
        xml_parse_into_struct($parser, $rawBody, $body);

        $message->fileURL = null;
        
        foreach ($body as $tag) {
            switch($tag['tag']) {
            case "FILE-SIZE":
                $message->fileSize = (int)$tag['value'];
                fileContentType;
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
        xmlwriter_start_attribute($xw, 'type');
        xmlwriter_text($xw, 'file');

        if (isset($this->fileSize)) {
            xmlwriter_start_attribute($xw, 'file-size');
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

        if (isset($this->fileURL)) {
            xmlwriter_start_element($xw, 'data');
            xmlwriter_start_attribute($xw, 'url');
            xmlwriter_text($xw, $this->fileURL);
            xmlwriter_end_element($xw);
        }

        xmlwriter_end_element($xw);

        xmlwriter_end_element($xw);

        $body = xmlwriter_output_memory($xw);


        if (!array_key_exists('content-length', $this->headers)) {
            $this->headers['content-length'] = strlen($body);
        }

        if (!array_key_exists('content-type', $this->headers)) {
            $this->headers['content-type'] = "application/vnd.gsma.rcs-ft-http+xml";
        }

        $contentHeaders = array("content-type", "content-length");

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

        $out = implode("\n", $firstHeaderBlock)."\n\n".implode("\n", $secondHeaderBlock)."\n\n".$body;

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
