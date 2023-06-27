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
?>
<style type="text/css">
  .container-fluid {
    height: calc(100% - 108px);
  }

  #main_content {
    height: calc(100% - 108px);
  }

  .thread {
    max-width: 50em;
    height: calc(100% - 120px);
    margin: 0 auto;
    border-left: solid #999 2px;
    border-right: solid #999 2px;
    border-bottom: solid #999 2px;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    padding-left: 0.5em;
    padding-right: 0.5em;

    /* stupid hack to get the text entry box to display inside the bounds of the thread */
    display: flex; 
    flex-direction: column;
  }

  .thread-header {
    max-width: 50em;
    margin: 0 auto;
    padding: 1em;
    background-color: rgba(0,0,0,0.90);
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
  }

  .white {
    color: #fff;
  }

  .message-container {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    height: 100%;
    overflow: scroll;
    margin-bottom: 0.5em;
  }

	.message {
		margin-top: 0.5em;
		border: solid #aaa 1px;
		border-radius: 1em;
    padding-left: 0.75em;
    padding-right: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    width: fit-content
	}

	.message-inbound {
		float: right;
	}

  .sendbox {
    display: flex;
    margin-bottom: 0.5em;
    background-color: #eee;
  }

  .textentry {
    border: 0;
    background-color: inherit;
    resize: none; /* prevent the user from resizing the text box */
    flex-grow: 1;
  }

  .btn-attach {
    padding: 0;
    margin: auto 0;
  }

  .btn-send {
    flex-grow: 1;
    max-width: fit-content;
    margin: auto 0;
  }

  .textentry:focus {
    outline: none; /* hide the browser's extra focus outline */
  }

  .timestamp {
    font-size: 7pt;
  }

  .message-body {
    margin: 0;
  }

  .statusbox {
    font-size: 7pt;
    text-align: right;
  }

  .statusbox .error {
    color: #ff5555;
  }

  .attachment-preview {
    display: flex;
    justify-content: left;
    background-color: #eee;
  }

  .attachment-preview-wrapper {
    height: 150px;
    width: 150px;
  }

  .attachment-preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>

<?php
echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting</b> - ".htmlspecialchars($extension['outbound_caller_id_name'])." (".htmlspecialchars($extension['outbound_caller_id_number']).")</div>";
echo "	<div class='actions'>\n";
// echo button::create(['type'=>'button','icon'=>'bell-slash', 'style' => 'display: none','id'=>'notification-btn', 'label' => '?', 'onclick' => 'toggleNotifications()']);
echo button::create(['type'=>'button','label'=>"All Texts",'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'threadlist.php?extension_uuid='.$extension['extension_uuid']]);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<br />\n";

$displayName = "";
if ($_GET['group']) {
    $frontendOpts['group_uuid'] = $_GET['group'];
    $displayName = htmlspecialchars($_GET['group']);
} else {
    $frontendOpts['remote_number'] = $_GET['number'];

    // compute the name to display based on number and a potential contact name
    $sql = "SELECT v_contacts.contact_uuid, v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
    $parameters['number'] = $number;
    $parameters['domain_uuid'] = $domain_uuid;
    $database = new database;
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

// The UX here is confusing to the point that I have disabled it, because we can't pre-file the contact number,
// and if the user forgets to do that they just make a contact with no number. Solution would be to create a blank
// contact with just a number and redirect to it's edit screen when this is clicked
// if($displayName == $number && permission_exists('contact_phone_add')) {
//   $displayName .= " <small><a class='white' href='/app/contacts/contact_edit.php'><span class='fas fa-edit fa-fw'> </span></a></small>";
// }

?>
<div class="thread-header">
  <?php echo $displayName; ?>
</div>
<div class="thread">
  <div class="message-container">
    <?php
    $database = new database;

    $sql = "SELECT * FROM webtexting_messages WHERE extension_uuid = :extension_uuid AND domain_uuid = :domain_uuid AND ";
    if ($_GET['group']) {
        $sql .= "group_uuid = :group_uuid";
        $parameters['group_uuid'] = $_GET['group'];
    } else {
        $sql .= "(from_number = :number OR to_number = :number) AND group_uuid IS NULL";
        $parameters['number'] = $_GET['number'];
    }
    $sql .= " ORDER BY start_stamp DESC LIMIT 50";
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['domain_uuid'] = $domain_uuid;
    $messages = $database->select($sql, $parameters, 'all');

    $i = count($messages);
    while ($i) {
        $message = $messages[--$i];
        echo "<div class='message-wrapper'>";
        echo "<div class='message message-".$message['direction']."'>";
        echo "<p class='message-body'>".htmlspecialchars($message['message'])."</p>";
        echo "<span class='timestamp' data-timestamp='".$message['start_stamp']."'></span>";
        echo "</div>";
        echo "</div>";
    }
    unset($parameters);
    ?>
  </div>
  <div class="attachment-preview"></div>
  <div class="sendbox">
    <textarea class="textentry" autofocus="autofocus"></textarea>
    <label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label>
    <input type="file" multiple id="attachment-upload" style="display: none;" />
    <button class="btn btn-send" disabled><span class="fas fa-paper-plane fa-fw"></span></button>
  </div>
  <div class="statusbox">loading</div>
</div>

<?php
$sql = "SELECT v_extensions.extension, v_extensions.password FROM v_extensions, v_domains WHERE v_domains.domain_uuid = v_extensions.domain_uuid AND v_domains.domain_name = :domain_name AND v_extensions.extension_uuid = :extension_uuid";
$parameters['domain_name'] = $extension['user_context'];
$parameters['extension_uuid'] = $extension['extension_uuid'];
$database = new database;
$extensionDetails = $database->select($sql, $parameters, 'row');

$frontendOpts['server'] = $extension['user_context'];
$frontendOpts['username'] = $extensionDetails['extension'];
$frontendOpts['password'] = $extensionDetails['password'];
?>
<script type="text/javascript">
  // webpush
  window.notification_data = <?php echo json_encode(array("extension_uuid" => $extension['extension_uuid'], "remote_identifier" => $number)); ?>;

  // sipjs
  const opts = <?php echo json_encode($frontendOpts); ?>;
</script>
<script src="lib/sip-0.21.2.min.js"></script>
<script src="frontend/cpim.js"></script>
<script src="thread.js"></script>
<?php
require_once "footer.php";
