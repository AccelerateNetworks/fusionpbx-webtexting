<?php

require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "header.php";
require_once "resources/paging.php";

if(!$_SESSION['user']['extension']) {
	echo "no extensions assigned to user";
	include_once "footer.php";
	die();
}

if(sizeof($_SESSION['user']['extension']) == 1) {
	echo "<script type='text/javascript'>window.location.href = 'threadlist.php?extension_uuid=".$_SESSION['user']['extension'][0]['extension_uuid']."'; </script>";
}

echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting</b></div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<p>Select extension:</p>";
echo "<table class='table'>\n";

foreach($_SESSION['user']['extension'] as $extension) {
	if($extension['user_context'] != $_SESSION['domain_name']) {
		continue;
	}
	echo "<tr>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['user']."</a></td>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['outbound_caller_id_name']."</a></td>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['outbound_caller_id_number']."</a></td>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['description']."</a></td>";
	echo "</tr>";
}

echo "</table>";

if (if_group("superadmin")) {
    echo "<br /><a href='githook.php'>Check for app updates</a> | <a href='admin.php'>Number Administration</a><br />\n";
}

require_once "footer.php";
