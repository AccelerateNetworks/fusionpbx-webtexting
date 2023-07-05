<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

foreach ($_SESSION['user']['extension'] as $ext) {
    if ($ext['extension_uuid'] == $_GET['extension_uuid']) {
        $extension = $ext;
        break;
    }
}

if (!$extension) {
    echo "invalid extension, please <a href='index.php'>try again</a>";
    include "footer.php";
    die();
}

$sql = "SELECT phone_number FROM webtexting_destinations WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid";
$parameters['domain_uuid'] = $domain_uuid;
$parameters['extension_uuid'] = $extension['extension_uuid'];
$database = new database;
$ownNumber = $database->select($sql, $parameters, 'column');
unset($parameters);
?>
<link rel="stylesheet" href="js/style.css" />
<style type="text/css">
  .container-fluid {
    height: calc(100% - 108px);
  }

  #main_content {
    height: calc(100% - 108px);
  }

  #conversation {
    height: calc(100% - 100px);
  }
</style>

<?php
echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting</b> - ".htmlspecialchars($extension['outbound_caller_id_name'])." (".htmlspecialchars($ownNumber).")</div>";
echo "	<div class='actions'>\n";
// echo button::create(['type'=>'button','icon'=>'bell-slash', 'style' => 'display: none','id'=>'notification-btn', 'label' => '?', 'onclick' => 'toggleNotifications()']);
echo button::create(['type'=>'button','label'=>"All Texts",'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'threadlist.php?extension_uuid='.$extension['extension_uuid']]);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<br />\n";

$displayName = "";
if ($_GET['group']) {
    $frontendOpts['groupUUID'] = $_GET['group'];
    $displayName = htmlspecialchars($_GET['group']);

    $sql = "SELECT name, members FROM webtexting_groups WHERE domain_uuid = :domain_uuid AND extension_uuid = :extension_uuid AND group_uuid = :group_uuid";
    $parameters['domain_uuid'] = $domain_uuid;
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['group_uuid'] = $_GET['group'];
    $group = $database->select($sql, $parameters, 'row');
    unset($parameters);
    if(!$group) {
      echo "no such group";
      include "footer.php";
      die();
    }

    if ($group['name'] != null) {
        $displayName = $group['name'];
    } else {
        $displayName = $group['members'];
    }
} else {
    $frontendOpts['remoteNumber'] = $_GET['number'];

    // compute the name to display based on number and a potential contact name
    $sql = "SELECT v_contacts.contact_uuid, v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
    $parameters['number'] = $number;
    $parameters['domain_uuid'] = $domain_uuid;
    $contact = $database->select($sql, $parameters, 'row');
    unset($parameters);

    $displayName = $number;
    if ($contact) {
        $nameParts = array();
        if ($contact['contact_name_given']) {
            $nameParts[] = htmlspecialchars($contact['contact_name_given']);
        }
        if ($contact['contact_name_middle']) {
            $nameParts[] = htmlspecialchars($contact['contact_name_middle']);
        }
        if ($contact['contact_name_family']) {
            $nameParts[] = htmlspecialchars($contact['contact_name_family']);
        }
        if (sizeof($nameParts) > 0) {
            $displayName = implode(" ", $nameParts);
            $displayName .= " <small>";
            if (permission_exists('contact_phone_edit')) {
                $displayName .= "<a class='white' href='/app/contacts/contact_edit.php?id=".$contact['contact_uuid']."'><span class='fas fa-edit fa-fw'> </span></a> ";
            }
            $displayName .= "(".$number.")</small>";
        } elseif (permission_exists('contact_phone_edit')) {
            $displayName .= " <small><a class='white' href='/app/contacts/contact_edit.php?id=".$contact['contact_uuid']."'><span class='fas fa-edit fa-fw'> </span></a></small>";
        }
    }
}

// The UX here is confusing to the point that I have disabled it, because we can't pre-fill the contact number,
// and if the user forgets to fill it in manually they just make a contact with no number. Solution would be to
// create a blank contact with just a number and redirect to it's edit screen when this is clicked
// if($displayName == $number && permission_exists('contact_phone_add')) {
//   $displayName .= " <small><a class='white' href='/app/contacts/contact_edit.php'><span class='fas fa-edit fa-fw'> </span></a></small>";
// }

?>
<div id="conversation">Loading (javascript required)</div>
<?php
$sql = "SELECT v_extensions.extension, v_extensions.password FROM v_extensions, v_domains WHERE v_domains.domain_uuid = v_extensions.domain_uuid AND v_domains.domain_name = :domain_name AND v_extensions.extension_uuid = :extension_uuid";
$parameters['domain_name'] = $extension['user_context'];
$parameters['extension_uuid'] = $extension['extension_uuid'];
$database = new database;
$extensionDetails = $database->select($sql, $parameters, 'row');
unset($parameters);

$frontendOpts['server'] = $extension['user_context'];
$frontendOpts['username'] = $extensionDetails['extension'];
$frontendOpts['password'] = $extensionDetails['password'];
$frontendOpts['threadName'] = $displayName;
$frontendOpts["extensionUUID"] = $extension['extension_uuid'];
$frontendOpts['ownNumber'] = $ownNumber;
?>
<script type="text/javascript">
  // webpush
  window.notification_data = <?php echo json_encode(array("extension_uuid" => $extension['extension_uuid'], "remote_identifier" => $number)); ?>;
</script>
<script src="js/webtexting.umd.js"></script>
<script>
  WebTexting.initializeThreadJS(<?php echo json_encode($frontendOpts); ?>);
</script>
<?php
require_once "footer.php";
