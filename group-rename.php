<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

foreach ($_SESSION['user']['extension'] as $ext) {
    if ($ext['extension_uuid'] == $_POST['extension_uuid']) {
        $extension = $ext;
        break;
    }
}

if (!$extension) {
    echo "invalid extension, please <a href='index.php'>try again</a>";
    include "footer.php";
    die();
}

if($_POST['action']) {
      $sql = "UPDATE webtexting_groups SET name = :name WHERE group_uuid = :group_uuid AND extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid";
      $parameters['name'] = $_POST['name'];
      $parameters['group_uuid'] = $_POST['group'];
      $parameters['extension_uuid'] = $_POST['extension_uuid'];
      $parameters['domain_uuid'] = $domain_uuid;
      if($database->execute($sql, $parameters)) {
          message::add("group renamed");
      } else {
          message::add("error renaming group", 'negative');
      }
      unset($parameters);
  
  // redirect to the same page so the user's request to the page is a GET and refreshing doesn't re-run the action
  header("Location: /app/webtexting/threadlist.php?extension_uuid=".$_POST['extension_uuid']);
  die();
}
?>