<?php
/* This class implements encoding and decoding for Common Presence and Instant Messaging (CPIM) messages
 * CPIM is described in RFC3862 (https://www.rfc-editor.org/rfc/rfc3862)
 */

 class CPIMMessage {
    private array $headers;
    
    function __construct(string $raw) {
        $parts = explode("\n\n", $raw);
        $headers = parse_http_headers($parts[0]);
        
        $parser = xml_parser_create();
        xml_parse_into_struct($parser, $parts[2], $body);
    }

    function getAttachments() {
        return array(); // TODO: this should be a list of URLs
    }

    function getCC() {
        return array(); // TODO: this should return the value of the "cc" header if present
    }
 }
