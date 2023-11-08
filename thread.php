<?php 
$url = $_SERVER["HTTP_REFERER"]."threadlist.php?extension_uuid=".$_GET["extension_uuid"];
header("Location: ".$url); 
?>