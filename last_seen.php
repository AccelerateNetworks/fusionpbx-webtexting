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
    echo "invalid extension, please <a href='index.php'>try again</a>";
    http_response_code(400);
    echo json_encode(array("error" => "invalid or unauthorized extension"));
    //include_once "footer.php";
    die();
}

$database = new database;
$sql = "SELECT * FROM webtexting_threads_last_seen  WHERE extension_uuid = :extension_uuid AND thread_uuid = :thread_uuid AND domain_uuid = :domain_uuid ;";
$parameters["extension_uuid"] = $extension['extension_uuid'];
$parameters["thread_uuid"] = $_GET['thread_uuid'];
$parameters["domain_uuid"] = $domain_uuid;
$row_exists = $database->select($sql, $parameters, 'all');

if($row_exists){
    $sql = "UPDATE webtexting_threads_last_seen SET timestamp = NOW() WHERE extension_uuid = :extension_uuid AND thread_uuid = :thread_uuid AND domain_uuid = :domain_uuid ;";
    $parameters["extension_uuid"] = $extension['extension_uuid'];
    $parameters["thread_uuid"] = $_GET['thread_uuid'];
    $parameters["domain_uuid"] = $domain_uuid;
    $updated_last_seen  = $database->execute($sql, $parameters);
    if($updated_last_seen){
        //succeeded 
        echo(json_encode(["Update Success",$updated_last_seen]));
    }
    else{
        //failed
        echo(json_encode(["Update Failed",$updated_last_seen]));
    }
}
//else 
// insert row
else{
    $sql = "INSERT INTO webtexting_threads_last_seen (timestamp, extension_uuid,  thread_uuid, domain_uuid) VALUES ( NOW(), :extension_uuid, :thread_uuid, :domain_uuid)";
    $parameters["extension_uuid"] = $extension['extension_uuid'];
    $parameters["thread_uuid"] = $_GET['thread_uuid'];
    $parameters["domain_uuid"] = $domain_uuid;
    $insert_last_seen = $database->execute($sql, $parameters);
    if($insert_last_seen){
        //succeeded
        echo(json_encode(["New User_Thread Creation Success",$insert_last_seen]));
    }
    else{
        //failed
        echo(json_encode(["New User_Thread Creation Failed",$insert_last_seen]));

    }
}


