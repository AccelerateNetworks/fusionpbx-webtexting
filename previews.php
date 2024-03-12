<?php
require_once __DIR__."/vendor/autoload.php";
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";

header("Content-Type: application/json");

foreach ($_SESSION['user']['extension'] as $ext) {
    if ($ext['extension_uuid'] == $_GET['extension_uuid']) {
        $extension = $ext;
        break;
    }
}

if (!$extension) {
    http_response_code(400);
    echo json_encode(array("error" => "invalid or unauthorized extension"));
    die();
}

$database = new database;
// get user's number
$sql = "SELECT phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $extension['extension_uuid'];
$ownNumber = $database->select($sql, $parameters, 'column');
unset($parameters);
if (!$ownNumber) {
    echo "To use Web Texting purchase the service at <a href='https://acceleratenetworks.com/services/'>https://acceleratenetworks.com/services/</a> then <a href='mailto:https://acceleratenetworks.com/support/'>Contact Support</a>";
    echo "<br> No SMS-enabled number for this extension.";
    include_once "footer.php";
    die();
}

//this is for Contact Search
$query_string = '';

$sql = "SELECT *
FROM webtexting_threads,v_contacts , v_contact_phones
WHERE webtexting_threads.domain_uuid = :domain_uuid
AND webtexting_threads.domain_uuid = v_contacts.domain_uuid
AND v_contact_phones.contact_uuid = v_contacts.contact_uuid
AND webtexting_threads.remote_number = v_contact_phones.phone_number
AND LOWER(CONCAT(v_contacts.contact_organization , ' ' ,v_contacts.contact_name_given , ' ' , v_contacts.contact_name_middle , 
            ' ' , v_contacts.contact_name_family , ' ' , v_contacts.contact_nickname, ' ', v_contacts.contact_title, ' ', 
            v_contacts.contact_role) ) LIKE  LOWER('%'||:query_string||'%' )   ;";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['query_string'] = $query_string;
$solo_conversations = $database->select($sql, $parameters, 'all');
unset($parameters);
$z = 0;
if($solo_conversations){
    foreach ($solo_conversations as $solo) {
        $usedNumbers[$solo['phone_number']] = true;
        $threadPreviews[$z]['remoteNumber'] = $solo['phone_number'];
        $threadPreviews[$z]['displayName']= $solo['phone_number'];
        $threadPreviews[$z]['contactEditLink'] = "/app/contacts/contact_edit.php?id=".$solo['contact_uuid'];
    
        $threadPreviews[$z]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&number=".$solo['phone_number'];
        $threadPreviews[$z]['ownNumber'] = $ownNumber;
        $threadPreviews[$z]['timestamp'] = $solo['last_message'];
        $name_parts = array();
        if ($solo['contact_organization']) {
            $name_parts[] = $solo['contact_organization'];
        }
        if ($solo['contact_title']) {
           $name_parts[] = $solo['contact_title'];
        }
        if ($solo['contact_name_prefix']) {
            $name_parts[] = $solo['contact_name_prefix'];
        }
        if ($solo['contact_name_given']) {
            $name_parts[] = $solo['contact_name_given'];
        }
        if ($solo['contact_name_middle']) {
            $name_parts[] = $solo['contact_name_middle'];
        }
        if ($solo['contact_name_family']) {
            $name_parts[] = $solo['contact_name_family'];
        }
        if ($solo['contact_nickname']) {
            $name_parts[] = $solo['contact_nickname'];
        }
        if ($solo['contact_role']) {
            $name_parts[] = $solo['contact_role'];
        }
        if (sizeof($name_parts) > 0) {
            $threadPreviews[$z]['displayName'] = implode(" ", $name_parts);
        }
        $z++;
    }
}


//this is for group search
//TODO add group member contact names to member array
$sql = "SELECT * 
from webtexting_groups,webtexting_threads
where webtexting_groups.domain_uuid = :domain_uuid
	AND  webtexting_threads.domain_uuid = :domain_uuid
	AND extension_uuid = :extension_uuid
	AND webtexting_threads.group_uuid = webtexting_groups.group_uuid
	AND webtexting_groups.name  LIKE  LOWER('%'||:query_string||'%' );";
$parameters['extension_uuid'] = $extension['extension_uuid'];
$parameters['domain_uuid'] = $domain_uuid;
$parameters['query_string'] = $query_string;
$groups = $database->select($sql, $parameters, 'all');
unset($parameters);

if($groups){
    foreach ($groups as $group) {
        $threadPreviews[$z]['group_uuid'] = $group['group_uuid'];
        $threadPreviews[$z]['groupMembers'] = $group['members']; 
        if ($group['name'] != null) {
            $threadPreviews[$z]['displayName'] = $group['name'];
        } else {
            $threadPreviews[$z]['displayName'] = $group['members'];
        }
        $threadPreviews[$z]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&group_uuid=".$group['group_uuid'];
        $threadPreviews[$z]['ownNumber'] = $ownNumber;
        $threadPreviews[$z]['timestamp'] = $group['last_message'];
        $z++;
    }
}

//this is where we search for threads by number
$sql = "SELECT *
FROM webtexting_threads
WHERE webtexting_threads.domain_uuid = :domain_uuid
AND webtexting_threads.local_number = :local_number
AND webtexting_threads.remote_number LIKE  LOWER('%'||:query_string||'%' )   ;";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['local_number'] = $ownNumber;
$parameters['query_string'] = $query_string;
$number_results = $database->select($sql, $parameters, 'all');
unset($parameters);
if($number_results){
    foreach ($number_results as $result) {
        if($usedNumbers[$result['remote_number']]){ //duplicate entry protection for numbers that are contacts
            continue;
        }
        else{
            $threadPreviews[$z]['remoteNumber'] = $result['remote_number'];
            $threadPreviews[$z]['displayName']= $result['remote_number'];
            $threadPreviews[$z]['contactEditLink'] = "/app/contacts/contact_edit.php";
        
            $threadPreviews[$z]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&number=".$result['remote_number'];
            $threadPreviews[$z]['ownNumber'] = $ownNumber;
            $threadPreviews[$z]['timestamp'] = $result['last_message'];
            $z++;
        }
        
    }
}

//this is where we fetch and attach the bodyPreviews
$z=0;
foreach($threadPreviews as $preview){
    $sql = "SELECT * FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
    if ($preview['group_uuid'] != null) {
        $sql .= "group_uuid = :group_uuid";
        $parameters['group_uuid'] = $preview['group_uuid'];
    } else {
        $sql .= "(from_number = :number OR to_number = :number) AND group_uuid IS NULL";
        $parameters['number'] = $preview['remoteNumber'];
    }
    $sql .= " ORDER BY start_stamp DESC LIMIT 1";
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['domain_uuid'] = $domain_uuid;
    $last_message = $database->select($sql, $parameters, 'all');
    unset($parameters);
    if($last_message[0]['content_type'] == 'message/cpim'){
        $threadPreviews[$z]['bodyPreview'] = 'MMS Message.';
    }
    else{
        $threadPreviews[$z]['bodyPreview'] = $last_message[0]['message'];

    }
    $last_message = false;
    $z++;
}
echo(json_encode($threadPreviews));
return json_encode($threadPreviews);
//This handles group and contact search jsut need to add number search