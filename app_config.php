<?php
//application details
$apps[$x]['name'] = "Web Texting";
$apps[$x]['uuid'] = "0fc24db5-97d4-4f92-9a4c-fd6163c489eb";
$apps[$x]['category'] = "App";
$apps[$x]['subcategory'] = "";
$apps[$x]['version'] = "0.1";
$apps[$x]['license'] = "GNU General Public License v3";
$apps[$x]['url'] = "https://github.com/AccelerateNetworks/fusionpbx-webtexting";
$apps[$x]['description']['en-us'] = "Web Texting";

//schema details
$y=0;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_clients";
$apps[$x]['db'][$y]['table']['parent'] = "";

$z=0;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "client_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "endpoint";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "auth";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "p256dh";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$y++;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_subscriptions";
$apps[$x]['db'][$y]['table']['parent'] = "";

$z=0;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "subscription_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "foreign";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_domains";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "domain_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "client_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "webtexting_clients";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "client_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['pgsql'] = "uuid";
$apps[$x]['db'][$y]['fields'][$z]['type']['sqlite'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['type']['mysql'] = "char(36)";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['table'] = "v_extensions";
$apps[$x]['db'][$y]['fields'][$z]['key']['reference']['field'] = "extension_uuid";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "remote_identifier";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "notify of incoming messages from this number or group ID. NULL if all messages should be notified";

$y++;
$apps[$x]['db'][$y]['table']['name'] = "webtexting_settings";
$apps[$x]['db'][$y]['table']['parent'] = "";

$z=0;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "setting";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['key']['type'] = "primary";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";

$z++;
$apps[$x]['db'][$y]['fields'][$z]['name'] = "value";
$apps[$x]['db'][$y]['fields'][$z]['type'] = "text";
$apps[$x]['db'][$y]['fields'][$z]['description']['en-us'] = "";
