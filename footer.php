<?php
if(if_group("superadmin")) {
  echo "<br /><br /><br /><a href='githook.php'>Check for app updates</a><br />\n";
}

echo "<script type='text/javascript' src='webtexting.js'></script>";

require_once "resources/footer.php";
