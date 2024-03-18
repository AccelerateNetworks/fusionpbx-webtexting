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
$sql = "SELECT phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid";$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $extension['extension_uuid'];
$ownNumber = $database->select($sql, $parameters, 'column');
unset($parameters);
if($ownNumber[0]=='+'){
    $ownNumber = subStr($ownNumber,1);
}
if (!$ownNumber) {
    echo "To use Web Texting purchase the service at <a href='https://acceleratenetworks.com/services/'>https://acceleratenetworks.com/services/</a> then <a href='mailto:https://acceleratenetworks.com/support/'>Contact Support</a>";
    echo "<br> No SMS-enabled number for this extension.";
    include_once "footer.php";
    die();
}

//this is for Contact Search
if($_GET['query_string'] != null){
    $query_string = $_GET['query_string'];
    if(strlen($query_string)>2){
    }
}
else{
    $query_string = '';
}


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
            $contacts[$solo['phone_number']] = $threadPreviews[$z]['displayName'] ;
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
	AND LOWER(webtexting_groups.name)  LIKE  LOWER('%'||:query_string||'%' ) ";
$parameters['extension_uuid'] = $extension['extension_uuid'];
$parameters['domain_uuid'] = $domain_uuid;
$parameters['query_string'] = $query_string;

$groups = $database->select($sql, $parameters, 'all');
unset($parameters);

if($groups){
    foreach ($groups as $group) {
        $threadPreviews[$z]['groupUUID'] = $group['group_uuid'];
        $threadPreviews[$z]['groupMembers'] = $group['members']; 
        if ($group['name'] != null) {
            $display_name = $group['name'];
        } else {
            $display_name = $group['members'];
        }
        $group_members = explode(",",$group['members']);
        $threadPreviews[$z]['groupMembers'] = explode(",",$group['members']);
        $member_index =0;
        foreach( $group_members as $member ){
            if($contacts[$member] != null){ //we already got the contact name for most numbers might as well cut back on queries
                $threadPreviews[$z]['groupMembers'][$member_index] = $contacts[$member];
            }
            else if($member == $ownNumber){
                $threadPreviews[$z]['groupMembers'][$member_index] = 'Me';
            }
            else{
                $sql = "SELECT v_contacts.contact_uuid, v_contacts.contact_organization, v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family, v_contacts.contact_nickname, v_contacts.contact_title, v_contacts.contact_role FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
                $parameters['number'] = $member;
                $parameters['domain_uuid'] = $domain_uuid;
                $contact = $database->select($sql, $parameters, 'row');
                unset($parameters);

                if ($contact) {
                    $name_parts = array();
                    if ($contact['contact_organization']) {
                        $name_parts[] = $contact['contact_organization'];
                    }
                    if ($contact['contact_title']) {
                        $name_parts[] = $contact['contact_title'];
                    }
                    if ($contact['contact_name_prefix']) {
                        $name_parts[] = $contact['contact_name_prefix'];
                    }
                    if ($contact['contact_name_given']) {
                        $name_parts[] = $contact['contact_name_given'];
                    }
                    if ($contact['contact_name_middle']) {
                        $name_parts[] = $contact['contact_name_middle'];
                    }
                    if ($contact['contact_name_family']) {
                        $name_parts[] = $contact['contact_name_family'];
                    }
                    if ($contact['contact_nickname']) {
                        $name_parts[] = $contact['contact_nickname'];
                    }
                    if ($contact['contact_role']) {
                        $name_parts[] = $contact['contact_role'];
                    }
                    if (sizeof($name_parts) > 0) {
                        $threadPreviews[$z]['groupMembers'][$member_index] = implode(" ", $name_parts);
                    }
                }
                else{
                    $threadPreviews[$z]['groupMembers'][$member_index] = $member;
                }    
            }
            $member_index++;        
        } 
        $threadPreviews[$z]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&group=".$group['group_uuid'];
        $threadPreviews[$z]['ownNumber'] = $ownNumber;
        $threadPreviews[$z]['timestamp'] = $group['last_message'];
        $threadPreviews[$z]['displayName'] = $display_name;
        $z++;
    }
}



//this is where we fetch and attach the bodyPreviews
$z=0;
foreach($threadPreviews as $preview){
    $sql = "SELECT * FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
    if ($preview['groupUUID'] != null) {
        $sql .= "group_uuid = :group_uuid";
        $parameters['group_uuid'] = $preview['groupUUID'];
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
