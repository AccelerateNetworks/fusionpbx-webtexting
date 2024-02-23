<?php 
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

if(!$_SESSION['user']['extension']) {
	echo "no extensions assigned to user";
	include_once "footer.php";
	die();
}

if(sizeof($_SESSION['user']['extension']) == 1) {
	echo "<script type='text/javascript'>window.location.href = 'threadlist.php?extension_uuid=".$_SESSION['user']['extension'][0]['extension_uuid']."'; </script>";
}
