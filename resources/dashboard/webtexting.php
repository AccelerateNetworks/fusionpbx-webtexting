<?php
//create assigned extensions array

	if (is_array($_SESSION['user']['extension'])) {
		foreach ($_SESSION['user']['extension'] as $assigned_extension) {
			$assigned_extensions[$assigned_extension['extension_uuid']] = $assigned_extension['user'];
		}
	}
	unset($assigned_extension);
echo "<div class='hud_box'>\n";
echo "<div class='hud_content'>\n";
echo "	<span class='hud_title'><a onclick=\"document.location.href='".PROJECT_PATH."/app/webtexting/index.php'\">".'Webtexting'."</a></span>";

if(sizeof($_SESSION['user']['extension']) <1){
	echo "<table style='width: 100%;'>";
	echo "<tr>";
	echo "<td class='".$row_style[$i % 2]." hud_text' colspan='2'> No extensions assigned to user. Please contact support@acceleratenetworks.com or call ". "<a href='tel:1-206-858-8757'>1-206-858-8757</a>"." to get started!</td>";
	echo "</tr>";
	echo "</table>";
	echo "</div>";
	echo "</div>";
}
else{


$sql = "SELECT extension_uuid, phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid";
$parameters['domain_uuid'] = $domain_uuid;
foreach($database->select($sql, $parameters, 'all') as $d) {
    $smsenabled_extensions[$d['extension_uuid']] = $d;
}
unset($parameters);
foreach($smsenabled_extensions as $ext_for_desc) {
    $sql = "SELECT description FROM v_extensions WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid";
    $parameters['domain_uuid'] = $domain_uuid;
	$parameters['extension_uuid'] = $ext_for_desc['extension_uuid'];
	$result = $database->select($sql, $parameters, 'row');
	if($result['description']) {
		$smsenabled_extensions[$ext_for_desc['extension_uuid']]['description'] = $result['description'];
	}
	else {
		$smsenabled_extensions[$ext_for_desc['extension_uuid']]['description'] = 'N/A';
	}
}
$matched_smsenabled_extensions=0;
echo "<table class='tr_hover' style='width: 100%;'>";
echo "<tr>";
echo "<th class='hud_heading' width='15%'>Extension</th>";
echo "<th class='hud_heading' width='25%'>Phone Number</th>";
echo "<th class='hud_heading' width='40%'>Description</th>";
echo "<th class='hud_heading' width='40%'>Actions</th>";

echo "</tr>";
$i=0;
$row_style[0] = "row_style0";
$row_style[1] = "row_style1";

foreach($_SESSION['user']['extension'] as $extension) {
	if($extension['user_context'] != $_SESSION['domain_name']) {
		continue;
	}
	else if(!$smsenabled_extensions[$extension['extension_uuid']]){
		continue;
	}
	
	echo "<tr href='../../app/webtexting/threadlist.php?extension_uuid=".$extension['extension_uuid']."' >";
	echo "<td class='".$row_style[$i % 2]." hud_text'><a href='../../app/webtexting/threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$extension['user']."</a></td>";
	echo "<td class='".$row_style[$i % 2]." hud_text'><a href='../../app/webtexting/threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$smsenabled_extensions[$extension['extension_uuid']]['phone_number']."</a></td>";
	echo "<td class='".$row_style[$i % 2]." hud_text'><a href='../../app/webtexting/threadlist.php?extension_uuid=".$extension['extension_uuid']."'>".$smsenabled_extensions[$extension['extension_uuid']]['description']."</a></td>";
	echo "<td class='".$row_style[$i % 2]." hud_text'><button class='btn btn-default'><span>Start Texting</span></button></td>";

	echo "</tr>";
	$i++;
}

echo "</table>";
echo "</div>\n";
echo "</div>\n";	
}
?>