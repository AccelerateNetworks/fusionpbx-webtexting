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
    echo "no destination for this extension";
    include_once "footer.php";
    die();
}
?>
<style type="text/css">
.timestamp {
    color: #999;
    font-size: 8pt;
    padding-left: 0.5em;
}
.thread-name {
    font-size: 12pt;
    color: #000;
}
.thread-last-message {
    color: #000;
}
</style>
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
echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting</b> - ".$extension['outbound_caller_id_name']." (".$destination.")</div>\n";
echo "	<div class='actions'>\n";
if(sizeof($_SESSION['user']['extension']) > 1) {
    echo button::create(['type'=>'button','label'=>"All Extensions",'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'index.php']);
}
echo button::create(['type'=>'button','icon'=>'bell-slash', 'style' => 'display: none','id'=>'notification-btn', 'onclick' => 'toggleNotifications()']);
echo button::create(['type'=>'button','icon'=>$_SESSION['theme']['button_icon_add'],'onclick'=>"modal_open('modal-new-thread','new-thread-number');"]);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<table class='table'>\n";

$sql = "SELECT remote_number, group_uuid, last_message FROM webtexting_threads WHERE local_number = :local_number AND domain_uuid = :domain_uuid ORDER BY last_message";
$parameters['local_number'] = $destination;
$parameters['domain_uuid'] = $domain_uuid;
$threads = $database->select($sql, $parameters, 'all');
unset($parameters);

echo "<table>\n";
foreach ($threads as $thread) {
    $number = $thread['remote_number'];

    $group_uuid = $thread['group_uuid'];

    // get the latest message from this thread
    $sql = "SELECT * FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
    if ($group_uuid != null) {
        $sql .= "group_uuid = :group_uuid";
        $parameters['group_uuid'] = $group_uuid;
    } else {
        $sql .= "(from_number = :number OR to_number = :number)";
        $parameters['number'] = $number;
    }
    $sql .= " ORDER BY start_stamp DESC LIMIT 1";
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['domain_uuid'] = $domain_uuid;
    $last_message = $database->select($sql, $parameters, 'row');
    unset($parameters);

    $sql = "SELECT v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
    $parameters['number'] = $number;
    $parameters['domain_uuid'] = $domain_uuid;
    $contact = $database->select($sql, $parameters, 'row');
    unset($parameters);

    // compute the name to display based on number and a potential contact name
    $display_name = "";
    if ($group_uuid != null) {
        $sql = "SELECT name, members FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND group_uuid = :group_uuid";
        $parameters['domain_uuid'] = $domain_uuid;
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
        if ($contact) {
            $name_parts = array();
            if ($contact['contact_name_given']) {
                $name_parts[] = $contact['contact_name_given'];
            }
            if ($contact['contact_name_middle']) {
                $name_parts[] = $contact['contact_name_middle'];
            }
            if ($contact['contact_name_family']) {
                $name_parts[] = $contact['contact_name_family'];
            }
            if (sizeof($name_parts) > 0) {
                $display_name = implode(" ", $name_parts)." <small>(".$number.")</small>";
            }
        }
    }

    $link = "thread.php?extension_uuid=".$extension['extension_uuid']."&";
    if ($group_uuid != null) {
        $link .= "group=".$group_uuid;
    } else {
        $link .= "number=".$number;
    }

    echo "<tr><td>";
    echo "<a href='".$link."'>";
    echo "<span class='thread-name'>".htmlspecialchars($display_name)."</span><br />";
    echo "<span class='thread-last-message'>".htmlspecialchars($last_message['message'])."</span>";
    echo "<span class='timestamp' data-timestamp='".$last_message['start_stamp']."'></span>";
    echo "</a>";
    echo "</td></tr>\n";
}
echo "</table>\n";
?>
<script type="text/javascript">
    window.notification_data = <?php echo json_encode(array("extension_uuid" => $extension['extension_uuid'])); ?>;
    function clean_number() { // clean any non-digits out of the phone number box
        document.querySelector("#new-thread-number").value = document.querySelector("#new-thread-number").value.replace(/[^\d+]/g, "");
    }
</script>
<?php
require_once "footer.php";
