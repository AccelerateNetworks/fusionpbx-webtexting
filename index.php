<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

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
<?php

echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting</b></div>\n";
echo "	<div class='actions'>\n";
echo button::create(['type'=>'button','label'=>"Do not click",'icon'=>$_SESSION['theme']['button_icon_add'],'id'=>'btn_add','name'=>'btn_add','link'=>'key_edit.php']);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<br /><br />\n";
echo "<table class='table'>\n";

$sql = "SELECT from_number, to_number, direction FROM v_sms_messages WHERE extension_uuid = :extension_uuid GROUP BY from_number, to_number, direction";
$parameters['extension_uuid'] = $_SESSION['user']['extension'][0]['extension_uuid'];
$database = new database;
$messages = $database->select($sql, $parameters, 'all');
unset($parameters);

$threads = array();
foreach($messages as $message) {
	$number = $message['direction'] == "inbound" ? $message['from_number'] : $message['to_number'];
	if($threads[$number]) {
		continue;
	}

	$sql = "SELECT * FROM v_sms_messages WHERE extension_uuid = :extension_uuid AND (from_number = :number OR to_number = :number) ORDER BY start_stamp DESC LIMIT 1";
	$parameters['extension_uuid'] = $_SESSION['user']['extension'][0]['extension_uuid'];
	$parameters['number'] = $number;
	$database = new database;
	$threads[$number] = $database->select($sql, $parameters, 'row');
	unset($parameters);

	// TODO: lookup contact name for thread
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
	echo "<tr><td>";
	echo "<a href='thread.php?number=".$number."'>";
	echo "<span class='thread-name'>".$number."</span><br />";
	echo "<span class='thread-last-message'>".$thread['message']."</span>";
	echo "<span class='timestamp' data-timestamp='".$thread['start_stamp']."'></span>";
	echo "</a>";
	echo "</td></tr>\n";
}

echo "</table>\n";

require_once "footer.php";
