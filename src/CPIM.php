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
    public string $file_name;
    public int $file_size;
    public string $file_content_type;
    public string $file_url;

    /**
     * Construct a new CPIM
     */
    private function __construct()
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
        $message->_addHeaders($parts[0]);
        $message->_addHeaders($parts[1]);
    
        $parser = xml_parser_create();
        xml_parse_into_struct($parser, $parts[2], $body);
        
        foreach ($body as $tag) {
            switch($tag['tag']) {
            case "FILE-SIZE":
                $message->file_size = (int)$tag['value'];
                break;
            case "FILE-NAME":
                $message->file_name = $tag['value'];
                break;
            case "CONTENT-TYPE":
                $message->file_content_type = $tag['value'];
                break;
            case "DATA":
                $message->file_url = $tag['attributes']['URL'];
                break;
            }
        }

        return $message;
    }

    /**
     * Get a list of attachments
     * 
     * @return array a list of files attached to this CPIM message
     */
    function getAttachments(): array
    {
        return array(); // TODO: this should be a list of URLs
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

        return explode(";", $val);
    }

    /**
     * Get the value of a header
     * 
     * @param string $header the name of the header to lookup
     * 
     * @return string the value of the specified header, or null if absent
     */
    public function getHeader(string $header): string
    {
        $header = strtolower($header);
        if (array_key_exists($header, $this->headers)) {
            return $this->headers[$header];
        }

        return null;
    }
}
