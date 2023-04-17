<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

foreach($_SESSION['user']['extension'] as $ext) {
  if($ext['extension_uuid'] == $_GET['extension_uuid']) {
    $extension = $ext;
    break;
  }
}
  
if(!$extension) {
  echo "invalid extension, please <a href='index.php'>try again</a>";
  require_once "footer.php";
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
echo "	<div class='heading'><b>WebTexting</b> - ".$extension['outbound_caller_id_name']." (".$extension['outbound_caller_id_number'].")</div>\n";
echo "	<div class='actions'>\n";
if(sizeof($_SESSION['user']['extension']) > 1) {
	echo button::create(['type'=>'button','label'=>"All Extensions",'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'index.php']);
}
echo button::create(['type'=>'button','icon'=>$_SESSION['theme']['button_icon_add'],'onclick'=>"modal_open('modal-new-thread','new-thread-number');"]);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<br /><br />\n";
echo "<table class='table'>\n";

$sql = "SELECT from_number, to_number, direction FROM v_sms_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid GROUP BY from_number, to_number, direction";
$parameters['extension_uuid'] = $extension['extension_uuid'];
$parameters['domain_uuid'] = $domain_uuid;
$database = new database;
$messages = $database->select($sql, $parameters, 'all');
unset($parameters);

$threads = array();
foreach($messages as $message) {
    $number = $message['direction'] == "inbound" ? $message['from_number'] : $message['to_number'];
    if($threads[$number]) {
        continue;
    }

    $sql = "SELECT * FROM v_sms_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND (from_number = :number OR to_number = :number) ORDER BY start_stamp DESC LIMIT 1";
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['number'] = $number;
    $database = new database;
    $threads[$number] = $database->select($sql, $parameters, 'row');
    unset($parameters);

    $sql = "SELECT v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
    $parameters['number'] = $number;
    $parameters['domain_uuid'] = $domain_uuid;
    $database = new database;
    $threads[$number]['contact'] = $database->select($sql, $parameters, 'row');
    unset($parameters);
}
// $thread_order = array_keys($threads);
uksort($threads, function($a, $b) {
global $threads;
$a_time = strtotime($threads[$a]['start_stamp']);
$b_time = strtotime($threads[$b]['start_stamp']);
$result = $b_time - $a_time;
return $result;
});

reset($threads);

foreach($threads as $number => $thread) {

    // compute the name to display based on number and a potential contact name
    $display_name = $number;
    if($thread['contact']) {
        $name_parts = array();
        if($thread['contact']['contact_name_given']) {
            $name_parts[] = $thread['contact']['contact_name_given'];
        }
        if($thread['contact']['contact_name_middle']) {
            $name_parts[] = $thread['contact']['contact_name_middle'];
        }
        if($thread['contact']['contact_name_family']) {
            $name_parts[] = $thread['contact']['contact_name_family'];
        }
        if(sizeof($name_parts) > 0) {
            $display_name = implode(" ", $name_parts)." <small>(".$number.")</small>";
        }
    }

    echo "<tr><td>";
    echo "<a href='thread.php?number=".$number."&extension_uuid=".$extension['extension_uuid']."'>";
    echo "<span class='thread-name'>".$display_name."</span><br />";
    echo "<span class='thread-last-message'>".$thread['message']."</span>";
    echo "<span class='timestamp' data-timestamp='".$thread['start_stamp']."'></span>";
    echo "</a>";
    echo "</td></tr>\n";
}

echo "</table>\n";
?>
<script type="text/javascript">
    function clean_number() { // clean any non-digits out of the phone number box
        document.querySelector("#new-thread-number").value = document.querySelector("#new-thread-number").value.replace(/[^\d+]/g, "");
    }
</script>
<?php
require_once "footer.php";
