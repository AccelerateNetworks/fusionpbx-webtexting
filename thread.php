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

if($_POST['action']) {
  switch($_POST['action']) {
    case "rename-group":
      $sql = "UPDATE webtexting_groups SET name = :name WHERE group_uuid = :group_uuid AND extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid";
      $parameters['name'] = $_POST['name'];
      $parameters['group_uuid'] = $_POST['group'];
      $parameters['extension_uuid'] = $_GET['extension_uuid'];
      $parameters['domain_uuid'] = $domain_uuid;
      if($database->execute($sql, $parameters)) {
          message::add("group renamed");
      } else {
          message::add("error renaming group", 'negative');
      }
      unset($parameters);
      break;
    default:
      message::add("unknown action ".$_POST['action']." requested, no action taken", 'negative');
      break;
  }
  // redirect to the same page so the user's request to the page is a GET and refreshing doesn't re-run the action
  header("Location: /app/webtexting/thread.php?extension_uuid=".$_GET['extension_uuid']."&group=".$_POST['group']);
  die();
}

if($_GET['number'] && strlen($_GET['number']) == 10) {
  // 10 digit numbers get prefixed with a 1
  header("Location: /app/webtexting/thread.php?extension_uuid=".$_GET['extension_uuid']."&number=1".$_GET['number']);
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

    ?>

    <form method='post'>
      <input type="hidden" name="action" value="rename-group" />
      <input type="hidden" name="extension_uuid" value="<?php echo $extension['extension_uuid']; ?>" />
      <input type="hidden" name="group" value="<?php echo $_GET['group']; ?>" />
      <div id='modal-rename-group' class='modal-window'>
        <div>
            <span title="" class='modal-close' onclick="modal_close(); ">&times</span>
            <span class='modal-title'>Rename Group</span>
            <span class='modal-message'>New name: <input type="text" name="name" placeholder="My besties" value="<?php if($group['name']) {echo $group['name'];} ?>" /></span>
            <span class='modal-actions'>
                <button type='button' alt='Cancel' title='Cancel' onclick='modal_close();' class='btn btn-default' ><span class='fas fa-times fa-fw'></span><span class='button-label never pad'>Cancel</span></button>
                <button type='submit' value='Ok' id='btn_ok' alt='ok' title='ok' onclick='modal_close();' class='btn btn-default' style='float: right; margin-left: 15px' ><span class='fas fa-check fa-fw'></span><span class='button-label never pad'>Start</span></button>
            </span>
        </div>
      </div>
      <input type='hidden' name='key_uuid' id='key_uuid'/>
    </form>

    <?php

    if ($group['name'] != null) {
        $frontendOpts['threadName'] = $group['name'];
    }
    $frontendOpts['groupMembers'] = explode(",", $group['members']);
} else {
    $number = $_GET['number'];
    $frontendOpts['remoteNumber'] = $number;

    // compute the name to display based on number and a potential contact name
    $sql = "SELECT v_contacts.contact_uuid, v_contacts.contact_organization, v_contacts.contact_name_given, v_contacts.contact_name_prefix, v_contacts.contact_name_middle, v_contacts.contact_name_family, v_contacts.contact_nickname, v_contacts.contact_title, v_contacts.contact_role FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
    $parameters['number'] = $number;
    $parameters['domain_uuid'] = $domain_uuid;
    $contact = $database->select($sql, $parameters, 'row');
    unset($parameters);

    $displayName = $number;
    if ($contact) {
        $nameParts = array();
        if ($contact['contact_organization']) {
            $nameParts[] = htmlspecialchars($contact['contact_organization']);
        }
        if ($contact['contact_title']) {
            $nameParts[] = htmlspecialchars($contact['contact_title']);
        }
        if ($contact['contact_name_prefix']) {
          $nameParts[] = htmlspecialchars($contact['contact_name_prefix']);
        }
        if ($contact['contact_name_given']) {
            $nameParts[] = htmlspecialchars($contact['contact_name_given']);
        }
        if ($contact['contact_name_middle']) {
            $nameParts[] = htmlspecialchars($contact['contact_name_middle']);
        }
        if ($contact['contact_name_family']) {
            $nameParts[] = htmlspecialchars($contact['contact_name_family']);
        }
        if ($contact['contact_nickname']) {
            $nameParts[] = htmlspecialchars($contact['contact_nickname']);
        }
        if ($contact['contact_role']) {
            $nameParts[] = htmlspecialchars($contact['contact_role']);
        }
        if (sizeof($nameParts) > 0) {
            $frontendOpts['threadName'] = implode(" ", $nameParts);
            if (permission_exists('contact_phone_edit')) {
                $frontendOpts['contactEditLink'] = "/app/contacts/contact_edit.php?id=".$contact['contact_uuid'];
            }
        } elseif (permission_exists('contact_phone_edit')) {
          $frontendOpts['contactEditLink'] = "/app/contacts/contact_edit.php?id=".$contact['contact_uuid'];
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
$frontendOpts["extensionUUID"] = $extension['extension_uuid'];
$frontendOpts['ownNumber'] = $ownNumber;
//echo $frontendOpts;
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
