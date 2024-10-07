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
if($_GET['template_uuid']){

    //check if request has valid uuid
    if($_GET['template_uuid']=='undefined'){

    
        //do an add template
        $database = new database;
        $sql = "INSERT INTO webtexting_message_templates (domain_uuid, template_language, template_category, template_subcategory, template_subject, template_body, template_type, template_enabled, template_description)  VALUES (:domain_uuid, :template_lang, :template_cat, :template_subcat, :template_subject, :template_body, :template_type, :template_enabled, :template_desc)";
        $parameters['domain_uuid'] = $domain_uuid;
        $parameters['template_lang'] = $_GET['language'];
        $parameters['template_cat'] = $_GET['category'];
        $parameters['template_subcat'] = $_GET['subcategory'];
        $parameters['template_subject'] = $_GET['subject'];
        $parameters['template_body'] = $_GET['body'];
        $parameters['template_type'] = $_GET['templateType'];
        $parameters['template_enabled'] = $_GET['enabled'];
        $parameters['template_desc'] = $_GET['description'];
        if($database->execute($sql, $parameters)) {
            message::add("Template Added.");
        } else {
            message::add("Error Creating Template.", 'negative');
        }
        unset($parameters);
    }
    else{
        //valid template_uuid = update instead of add
        $database = new database;

        $sql = "UPDATE webtexting_message_templates SET template_language = :template_lang, template_category = :template_cat, template_subcategory = :template_subcat, template_subject = :template_subject, template_body = :template_body, template_type = :template_type, template_enabled = :template_enabled, template_description = :template_desc         WHERE email_template_uuid = :template_uuid AND domain_uuid = :domain_uuid";
            $parameters['template_uuid'] = $_GET['template_uuid'];
            $parameters['domain_uuid'] = $domain_uuid;
            $parameters['template_lang'] = $_GET['language'];
            $parameters['template_cat'] = $_GET['category'];
            $parameters['template_subcat'] = $_GET['subcategory'];
            $parameters['template_subject'] = $_GET['subject'];
            $parameters['template_body'] = $_GET['body'];
            $parameters['template_type'] = $_GET['templateType'];
            $parameters['template_enabled'] = $_GET['enabled'];
            $parameters['template_desc'] = $_GET['description'];
        if($database->execute($sql, $parameters)) {
            message::add("template edited.");
        } else {
            message::add("error saving changes to template.", 'negative');
        }
        unset($parameters);
    }
}
else if(!$_GET['template_uuid']){
   
    

    
//      
//         //do an edit template
//         //$domain_uuid;

}
else{
    //invalid request
}
