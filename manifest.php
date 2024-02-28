<?php
$start_url = 'https://'.$_SERVER['HTTP_HOST'].'/app/webtexting';
header('Content-Type: application/json');
echo "
{
  \"name\": \"Accelerate Networks Web Texting\",
  \"gcm_user_visible_only\": true,
  \"short_name\": \"Web Texting\",
  \"description\": \"Page for texting using the web.\",
  \"start_url\": \"$start_url\",
  \"display\": \"standalone\",
  \"orientation\": \"portrait\",
  \"icons\": [{
    \"src\": \"favicon.ico\",
    \"sizes\": \"any\",
    \"type\": \"image/ico\"
  }]
}
";
?>