<?php
if(if_group("superadmin")) {
  echo "<br /><a href='githook.php'>Check for app updates</a> | <a href='admin.php'>Number Administration</a><br />\n";
}

echo "<script type='text/javascript' src='webtexting.js'></script>";

require "resources/footer.php";
