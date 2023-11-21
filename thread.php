<?php 

$url = $_SERVER["HTTP_ORIGIN"]."/app/webtexting/threadlist.php?extension_uuid=".$_GET["extension_uuid"];
header("Location: ".$url); 
?>