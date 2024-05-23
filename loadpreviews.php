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
if($ownNumber[0]=='+'){
    $ownNumber = subStr($ownNumber,1);
}
if (!$ownNumber) {
    echo "To use Web Texting purchase the service at <a href='https://acceleratenetworks.com/services/'>https://acceleratenetworks.com/services/</a> then <a href='mailto:https://acceleratenetworks.com/support/'>Contact Support</a>";
    echo "<br> No SMS-enabled number for this extension.";
    include_once "footer.php";
    die();
}
//this is for Limiting the list of threads on initial load

$query_limit = 20;


$sql = 'SELECT * FROM webtexting_threads WHERE domain_uuid = :domain_uuid AND local_number = :local_number ';
if($_GET['older_than'] ){
    $sql .= 'AND last_message < to_timestamp(:older_than/1000.00)';
}
$sql.= ' ORDER BY last_message DESC LIMIT :query_limit ;';
$parameters['domain_uuid'] = $domain_uuid;
$parameters['local_number'] = $ownNumber;
if($_GET['older_than'] ){
    $parameters['older_than'] = $_GET['older_than'];
}
$parameters['query_limit'] = $query_limit;

$conversations = $database->select($sql,$parameters, 'all');
unset($parameters);
$i = 0;
$threadPreviews = [];
if($conversations){

    foreach ($conversations as $conversation){
        if($conversation['group_uuid']){
            //make the group preview
                //check if group has related name
                //else build no name group preview
    
    
                //this is for group construction
                //TODO add group member contact names to member array
                $sql = 'SELECT * 
                from webtexting_groups,webtexting_threads
                where webtexting_groups.domain_uuid = :domain_uuid
                    AND  webtexting_threads.domain_uuid = :domain_uuid
                    AND extension_uuid = :extension_uuid
                    AND webtexting_groups.group_uuid = :group_uuid
                    AND webtexting_threads.group_uuid = webtexting_groups.group_uuid LIMIT 1;';
                $parameters['extension_uuid'] = $extension['extension_uuid'];
                $parameters['domain_uuid'] = $domain_uuid;
                $parameters['group_uuid'] = $conversation['group_uuid'];
    
                $group = $database->select($sql, $parameters, 'row');
                unset($parameters);
    
                if($group){
                        $threadPreviews[$i]['groupUUID'] = $group['group_uuid'];
                        $threadPreviews[$i]['groupMembers'] = $group['members']; 
                        if ($group['name'] != null) {
                            $display_name = $group['name'];
                        } else {
                            $display_name = $group['members'];
                        }
                        $group_members = explode(",",$group['members']);
                        $threadPreviews[$i]['groupMembers'] = explode(",",$group['members']);
                        $member_index = 0;
                        foreach( $group_members as $member ){
                            if($member == $ownNumber){
                                $threadPreviews[$i]['groupMembers'][$member_index] = 'Me';
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
                                        $threadPreviews[$i]['groupMembers'][$member_index] = implode(" ", $name_parts);
                                    }
                                }
                                else{
                                    $threadPreviews[$i]['groupMembers'][$member_index] = $member;
                                }    
                            }
                            $member_index++;        
                        } 
                        $threadPreviews[$i]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&group=".$group['group_uuid'];
                        $threadPreviews[$i]['ownNumber'] = $ownNumber;
                        $threadPreviews[$i]['timestamp'] = $group['last_message'];
                        $threadPreviews[$i]['displayName'] = $display_name;
                }
                $group= null;
        }
        else{
            //make a solo preview
            if($conversation['remote_number'])
                $sql = "SELECT *
                        FROM webtexting_threads,v_contacts , v_contact_phones
                        WHERE webtexting_threads.domain_uuid = :domain_uuid
                        AND webtexting_threads.domain_uuid = v_contacts.domain_uuid
                        AND v_contact_phones.contact_uuid = v_contacts.contact_uuid
                        AND v_contact_phones.phone_number = :phone_number
                        AND webtexting_threads.remote_number = v_contact_phones.phone_number;";
                $parameters['domain_uuid'] = $domain_uuid;
                $parameters['phone_number'] = $conversation['remote_number'];
                $solo = $database->select($sql, $parameters, 'row');
                unset($parameters);
    
                if($solo){
                        $usedNumbers[$solo['phone_number']] = true;
                        $threadPreviews[$i]['remoteNumber'] = $solo['phone_number'];
                        $threadPreviews[$i]['displayName']= $solo['phone_number'];
                        $threadPreviews[$i]['contactEditLink'] = "/app/contacts/contact_edit.php?id=".$solo['contact_uuid'];
                    
                        $threadPreviews[$i]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&number=".$solo['phone_number'];
                        $threadPreviews[$i]['ownNumber'] = $ownNumber;
                        $threadPreviews[$i]['timestamp'] = $solo['last_message'];
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
                            $threadPreviews[$i]['displayName'] = implode(" ", $name_parts);
                            $contacts[$solo['phone_number']] = $threadPreviews[$i]['displayName'] ;
                        }    
                        $solo= null;            
                }
                
                else{
                    //this could probably be a row instead of an all select
                    $sql = "SELECT *
                        FROM webtexting_threads
                        WHERE webtexting_threads.domain_uuid = :domain_uuid
                        AND webtexting_threads.remote_number = :remote_number
                        AND webtexting_threads.local_number = :local_number;";
                    $parameters['domain_uuid'] = $domain_uuid;
                    $parameters['local_number'] = $ownNumber;
                    $parameters['remote_number'] = $conversation['remote_number'];
                    $result = $database->select($sql, $parameters, 'all');
                    unset($parameters);
                    if($result){
                            if($usedNumbers[$result[0]['remote_number']]){ //duplicate entry protection for numbers that are contacts
                                continue;
                            }
                            else{
                                $threadPreviews[$i]['remoteNumber'] = $result[0]['remote_number'];
                                $threadPreviews[$i]['displayName']= $result[0]['remote_number'];
                                $threadPreviews[$i]['contactEditLink'] = "/app/contacts/contact_edit.php";
    
                                $threadPreviews[$i]['link'] = "thread.php?extension_uuid=".$extension['extension_uuid']."&number=".$result[0]['remote_number'];
                                $threadPreviews[$i]['ownNumber'] = $ownNumber;
                                $threadPreviews[$i]['timestamp'] = $result[0]['last_message'];
                            }
                        }
                    }
                    $result = null;
                
            //else build no contact solo preview
        }
        $i++;
    }
    // //this is where we fetch and attach the bodyPreviews
    $i=0;
    foreach($threadPreviews as $preview){
        $sql = "SELECT * FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
        if ($preview['groupUUID'] ) {
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
            $threadPreviews[$i]['bodyPreview'] = 'MMS Message.';
        }
        else{
            $threadPreviews[$i]['bodyPreview'] = $last_message[0]['message'];
    
        }
        $last_message = false;
        $i++;
    }
}
echo(json_encode($threadPreviews));
return json_encode($threadPreviews);
//This handles group and contact search jsut need to add number search
