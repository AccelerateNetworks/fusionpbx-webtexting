<?php
if (!isset($_SESSION)) { session_start(); }

use GuzzleHttp\Client;

require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "header.php";
require_once "resources/paging.php";
require_once __DIR__."/vendor/autoload.php";



if(!$_SESSION['user']['extension']) {
	echo "No extensions assigned to user. Please contact support@acceleratenetworks.com to get started with WebTexting!";
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
echo "<thead>";
echo "<tr>";
echo "<th scope='col'>Extension</th>";
echo "<th scope='col'>Extension Name</th>";
echo "<th scope='col'>Phone Number</th>";
echo "<th scope='col'>Description</th>";
echo "</tr>";
echo "</thead>";
$sql = "SELECT extension_uuid, phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid";
$parameters['domain_uuid'] = $domain_uuid;
foreach($database->select($sql, $parameters, 'all') as $d) {
    $smsenabled_extensions[$d['extension_uuid']] = $d;
}
unset($parameters);
$matched_smsenabled_extensions=0;
foreach($_SESSION['user']['extension'] as $extension) {
	if($extension['user_context'] != $_SESSION['domain_name']) {
		continue;
	}
	else if(!$smsenabled_extensions[$extension['extension_uuid']]){
		continue;
	}
	echo "<tr>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['user']."</a></td>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$smsenabled_extensions[$extension['extension_uuid']]['phone_number']."</a></td>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['outbound_caller_id_name']."</a></td>";
	echo "<td><a href='threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['description']."</a></td>";
	echo "</tr>";
	$matched_smsenabled_extensions++;
}

echo "</table>";

if (if_group("superadmin")) {
    echo "<br /><a class='btn btn-danger' href='admin.php'>WebTexting Administration</a><br />\n";
}
if($matched_smsenabled_extensions>1){
	$_SESSION['user']['multiple_wt_extensions'] = true;
}
else{
	$_SESSION['user']['multiple_wt_extensions'] = false;
}

require_once "footer.php";
