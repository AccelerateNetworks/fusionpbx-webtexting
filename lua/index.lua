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
    s = string.gsub(s, "%s", "+");
    return s;
end


api = freeswitch.API();
resp = api:execute("curl", "http://localhost/app/webtexting/outbound-hook.php post " .. uriescape(message:serialize("json")))
freeswitch.consoleLog("info", "response from outbound sms hook: "..resp)
