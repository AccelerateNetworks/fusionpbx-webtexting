<?php 
require_once "resources/require.php";
require_once "resources/check_auth.php";
$url = $_SERVER["HTTP_ORIGIN"]."/app/webtexting/";
header("Location: ".$url); 
?>