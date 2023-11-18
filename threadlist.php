<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

foreach ($_SESSION['user']['extension'] as $ext) {
    if ($ext['extension_uuid'] == $_GET['extension_uuid']) {
        $extension = $ext;
        break;
    }
}
  
if (!$extension) {
    echo "invalid extension, please <a href='index.php'>try again</a>";
    include_once "footer.php";
    die();
}

$database = new database;

$sql = "SELECT phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $extension['extension_uuid'];
$destination = $database->select($sql, $parameters, 'column');
unset($parameters);
if (!$destination) {
    echo "no SMS-enabled number for this extension";
    include_once "footer.php";
    die();
}
?>
<form method='get' action="thread.php" onsubmit="clean_number()">
<input type="hidden" name="extension_uuid" value="<?php echo $extension['extension_uuid']; ?>" />
<div id='modal-new-thread' class='modal-window'>
    <div>
        <span title="" class='modal-close' onclick="modal_close(); ">&times</span>
        <span class='modal-title'>New Message</span>
        <span class='modal-message'>Enter Number: <input type="text" name="number" id="new-thread-number" placeholder="(206) 555-1212" /></span>
        <span class='modal-actions'>
            <button type='button' alt='Cancel' title='Cancel' onclick='modal_close();' class='btn btn-default' ><span class='fas fa-times fa-fw'></span><span class='button-label never pad'>Cancel</span></button>
            <button type='submit' name='action' value='Ok' id='btn_ok' alt='ok' title='ok' onclick='modal_close();' class='btn btn-default' style='float: right; margin-left: 15px' ><span class='fas fa-check fa-fw'></span><span class='button-label never pad'>Start</span></button>
        </span>
    </div>
</div>
<input type='hidden' name='key_uuid' id='key_uuid'/>
</form>
<?php
$page = 0;
$page_size = 25;
$sql = "SELECT remote_number, group_uuid, last_message FROM webtexting_threads WHERE local_number = :local_number AND domain_uuid = :domain_uuid ORDER BY last_message DESC LIMIT ".$page_size;
if($_GET['page']) {
    $sql .= " OFFSET :page";
    $page = intval($_GET['page']);
    $parameters['page'] = $page*$page_size;
}

$parameters['local_number'] = $destination;
$parameters['domain_uuid'] = $domain_uuid;
$threads = $database->select($sql, $parameters, 'all');
unset($parameters);

//for each thread get the last message and render a preview template
//threads is the thing we need to make available to threadlist.vue to populate every ThreadPreview.vue
//where do we need to go for the rest of the frontendopts 

//these two query blocks are ripped from thread.php
//the intent is that I use these to get comfortable with delivering the vue app then i remove these
$sql = "SELECT phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $extension['extension_uuid'];
$database = new database;
$ownNumber = $database->select($sql, $parameters, 'column');
unset($parameters);

$sql = "SELECT v_extensions.extension, v_extensions.password FROM v_extensions, v_domains WHERE v_domains.domain_uuid = v_extensions.domain_uuid AND v_domains.domain_name = :domain_name AND v_extensions.extension_uuid = :extension_uuid";
$parameters['domain_name'] = $extension['user_context'];
$parameters['extension_uuid'] = $extension['extension_uuid'];
$database = new database;
$extensionDetails = $database->select($sql, $parameters, 'row');
unset($parameters);

$frontendOpts['server'] = $extension['user_context'];
$frontendOpts['username'] = $extensionDetails['extension'];
$frontendOpts['password'] = $extensionDetails['password'];
$frontendOpts["extensionUUID"] = $extension['extension_uuid'];
$frontendOpts['ownNumber'] = $ownNumber;
$frontendOpts['threads'] = $threads;
echo "<div id='TEST_DIV_FOR_TESTING_WEBTEXTING'></div>";
//echo $frontendOpts;
$z=0;
foreach ($threads as $thread) {
    $number = $thread['remote_number'];
    $thread_preview_opts[$z]['remoteNumber'] = $number;
    $group_uuid = $thread['group_uuid'];
    $thread_preview_opts[$z]['groupUUID'] = $group_uuid;
    // get the latest message from this thread
    $sql = "SELECT * FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
    if ($group_uuid != null) {
        $sql .= "group_uuid = :group_uuid";
        $parameters['group_uuid'] = $group_uuid;
    } else {
        $sql .= "(from_number = :number OR to_number = :number) AND group_uuid IS NULL";
        $parameters['number'] = $number;
    }
    $sql .= " ORDER BY start_stamp DESC LIMIT 1";
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['domain_uuid'] = $domain_uuid;
    $last_message = $database->select($sql, $parameters, 'row');
    unset($parameters);
    $thread_preview_opts[$z]['last_message'] =  $last_message;
    $thread_preview_opts[$z]['timestamp'] = $last_message['start_stamp'];
    // compute the name to display based on number and a potential contact name
    $display_name = "";
    if ($group_uuid != null) {
        $sql = "SELECT name, members FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid AND group_uuid = :group_uuid";
        $parameters['domain_uuid'] = $domain_uuid;
        $parameters['extension_uuid'] = $extension['extension_uuid'];
        $parameters['group_uuid'] = $group_uuid;
        $group = $database->select($sql, $parameters, 'row');
        unset($parameters);
        if ($group['name'] != null) {
            $display_name = $group['name'];
        } else {
            $display_name = $group['members'];
        }
    } else {
        $display_name = $number;
        $thread_preview_opts[$z]['displayName'] = $display_name;
        $sql = "SELECT v_contacts.contact_uuid, v_contacts.contact_organization, v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family, v_contacts.contact_nickname, v_contacts.contact_title, v_contacts.contact_role FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
        $parameters['number'] = $number;
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
                $display_name = implode(" ", $name_parts);
            }
        }
    }
    $frontendOpts['server'] = $extension['user_context'];
$frontendOpts['username'] = $extensionDetails['extension'];
$frontendOpts['password'] = $extensionDetails['password'];
$frontendOpts["extensionUUID"] = $extension['extension_uuid'];
$frontendOpts['ownNumber'] = $ownNumber;

    $link = "thread.php?extension_uuid=".$extension['extension_uuid']."&";
    if ($group_uuid != null) {
        $link .= "group=".$group_uuid;
    } else {
        $link .= "number=".$number;
    }
    $thread_preview_opts[$z]['link'] = $link;
    //Thread preview area 
    $body_preview = $last_message['content_type'] == "text/plain" ? $last_message['message'] : "[media]";
    $thread_preview_opts[$z]['bodyPreview'] = $body_preview;
    $thread_preview_opts[$z]['ownNumber'] = $ownNumber;
    $z++;
 }
 $frontendOpts['$thread_preview_opts'] = $thread_preview_opts;
?>

<script src="js/webtexting.umd.js"></script>
<script type="text/javascript">
    window.notification_data = <?php echo json_encode(array("extension_uuid" => $extension['extension_uuid'])); ?>;
    function clean_number() { // clean any non-digits out of the phone number box
        document.querySelector("#new-thread-number").value = document.querySelector("#new-thread-number").value.replace(/[^\d+]/g, "");
    }
    </script>

<?php
require_once "footer.php";
?>
<link rel="stylesheet" href="js/style.css" />
<link rel="stylesheet" href="src/footer.css"/>
<script type="text/javascript">
WebTexting.initializeWebTextingContainer(<?php echo json_encode($frontendOpts); ?>);
</script>

<style type="text/css">
  /* .container-fluid {
    height: calc(100% - 108px);
  }

  #main_content {
    height: calc(100% - 108px);
  }

  #conversation {
    height: calc(100% - 100px);
  } */

#WEB_TEXT_ROOT {
    display:grid;
    grid-template-columns: 30% 1fr;
    grid-template-rows: auto;
}
@media screen and (width <= 700px) {
    #WEB_TEXT_ROOT{
    grid-template-columns:100%;
    grid-template-rows:80vh;
    height: 85vh;
    }



}



    




</style>