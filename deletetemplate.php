<?php
require_once __DIR__."/vendor/autoload.php";
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";

header("Content-Type: application/json");

foreach ($_SESSION['user']['extension'] as $ext) {
    if ($ext['extension_uuid'] == $_GET['extension_uuid']) {
        $extension = $ext;
        break;
    }
}


if (!$extension) {
    http_response_code(400);
    echo json_encode(array("error" => "invalid or unauthorized extension"));
    die();
}
    $database = new database;

    $sql = "DELETE from webtexting_message_templates WHERE domain_uuid = :domain_uuid AND email_template_uuid = :template_uuid;";
         $parameters['domain_uuid'] = $domain_uuid;
         $parameters['template_uuid'] = $_GET['template_uuid'];
         $deleted = $database->select($sql, $parameters, 'all');
      if($deleted){
          message::add("template deleted.");
      } else {
          message::add("error deleting template.", 'negative');
      }
      echo(json_encode($templates));
      return json_encode($templates);
//       unset($parameters);
//         //do an edit template
//         //$domain_uuid;