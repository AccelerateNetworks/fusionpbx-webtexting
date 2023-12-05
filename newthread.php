<?php 
        //$sql = "INSERT INTO webtexting_threads (domain_uuid, remote_number, local_number, last_message) VALUES (:domain_uuid, :from, :to, NOW())";

$url = $_SERVER["HTTP_ORIGIN"]."/app/webtexting/thread.php?extension_uuid=".$_GET["extension_uuid"]."&number=".$_GET["number"];
header("Location: ".$url); 
?>