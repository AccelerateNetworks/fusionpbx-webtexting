-- this script expects to be invoked as part of the chatplan for outbound SMSs. It serializes the message and POSTs it to a pre-defined URL

-- based on sample in mod_curl documentation (https://developer.signalwire.com/freeswitch/FreeSWITCH-Explained/Modules/mod_curl_3965033/)
function uriescape (s)
    s = string.gsub(
        s,
        '([\r\n"#%%&+:;<=>?@^`{|}%\\%[%]%(%)$!~,/\'])',
        function (c)
            return '%'..string.format("%02X", string.byte(c));
        end
    );
    -- Encode whitespace as %20 (RFC 3986), not "+" (form-urlencoded). Together with the
    -- first gsub above (which escapes literal "+" to %2B), this gives a fully RFC 3986–
    -- consistent encoding. mod_curl decodes %XX in transit but leaves "+" literal, so the
    -- receiving side (outbound-hook.php) must use rawurldecode (RFC 3986) to match.
    -- Do NOT change to "+" without coordinating the decoder change in outbound-hook.php.
    s = string.gsub(s, "%s", "%%20");
    return s;
end


api = freeswitch.API();
resp = api:execute("curl", "http://localhost/app/webtexting/outbound-hook.php post " .. uriescape(message:serialize("json")))
freeswitch.consoleLog("info", "response from outbound sms hook: "..resp)