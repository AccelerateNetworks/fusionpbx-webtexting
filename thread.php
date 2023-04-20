<?php
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

foreach($_SESSION['user']['extension'] as $ext) {
  if($ext['extension_uuid'] == $_GET['extension_uuid']) {
    $extension = $ext;
    break;
  }
}

if(!$extension) {
  echo "invalid extension, please <a href='index.php'>try again</a>";
  require_once "footer.php";
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
  }

  .textentry {
    border: 0;
    background-color: #eee;
    resize: none; /* prevent the user from resizing the text box */
    flex-grow: 1;
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
</style>

<?php
$number = $_GET['number'];
echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting</b> - ".$extension['outbound_caller_id_name']." (".$extension['outbound_caller_id_number'].")</div>";
echo "	<div class='actions'>\n";
echo button::create(['type'=>'button','icon'=>'bell-slash', 'style' => 'display: none','id'=>'notification-btn', 'label' => '?', 'onclick' => 'toggleNotifications()']);
echo button::create(['type'=>'button','label'=>"All Texts",'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'threadlist.php?extension_uuid='.$extension['extension_uuid']]);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<br />\n";

// compute the name to display based on number and a potential contact name
$sql = "SELECT v_contacts.contact_uuid, v_contacts.contact_name_given, v_contacts.contact_name_middle, v_contacts.contact_name_family FROM v_contact_phones, v_contacts WHERE v_contact_phones.phone_number = :number AND v_contact_phones.domain_uuid = :domain_uuid AND v_contacts.contact_uuid = v_contact_phones.contact_uuid LIMIT 1;";
$parameters['number'] = $number;
$parameters['domain_uuid'] = $domain_uuid;
$database = new database;
$contact = $database->select($sql, $parameters, 'row');
unset($parameters);

$display_name = $number;
if($contact) {
    $name_parts = array();
    if($contact['contact_name_given']) {
        $name_parts[] = $contact['contact_name_given'];
    }
    if($contact['contact_name_middle']) {
        $name_parts[] = $contact['contact_name_middle'];
    }
    if($contact['contact_name_family']) {
        $name_parts[] = $contact['contact_name_family'];
    }
    if(sizeof($name_parts) > 0) {
        $display_name = implode(" ", $name_parts);
        $display_name .= " <small>";
        if(permission_exists('contact_phone_edit')) {
          $display_name .= "<a class='white' href='/app/contacts/contact_edit.php?id=".$contact['contact_uuid']."'><span class='fas fa-edit fa-fw'> </span></a> ";
        }
        $display_name .= "(".$number.")</small>";
    } elseif(permission_exists('contact_phone_edit')) {
      $display_name .= " <small><a class='white' href='/app/contacts/contact_edit.php?id=".$contact['contact_uuid']."'><span class='fas fa-edit fa-fw'> </span></a></small>";
    }
}

// The UX here is confusing to the point that I have disabled it, because we can't pre-file the contact number,
// and if the user forgets to do that they just make a contact with no number. Solution would be to create a blank
// contact with just a number and redirect to it's edit screen when this is clicked
// if($display_name == $number && permission_exists('contact_phone_add')) {
//   $display_name .= " <small><a class='white' href='/app/contacts/contact_edit.php'><span class='fas fa-edit fa-fw'> </span></a></small>";
// }

?>
<div class="thread-header">
  <?php echo $display_name; ?>
</div>
<div class="thread">
  <div class="message-container">
    <?php
    $sql = "SELECT * FROM v_sms_messages WHERE extension_uuid = :extension_uuid AND (from_number = :number OR to_number = :number) ORDER BY start_stamp DESC LIMIT 50";
    $parameters['extension_uuid'] = $extension['extension_uuid'];
    $parameters['number'] = $number;
    $database = new database;
    $messages = $database->select($sql, $parameters, 'all');
    $i = count($messages);
    while($i) {
      $message = $messages[--$i];
      echo "<div class='message-wrapper'>";
      echo "<div class='message message-".$message['direction']."'>";
      echo "<p class='message-body'>".$message['message']."</p>";
      echo "<span class='timestamp' data-timestamp='".$message['start_stamp']."'></span>";
      echo "</div>";
      echo "</div>";
    }
    unset($parameters);
    ?>
  </div>
  <div class="sendbox">
    <textarea class="textentry" autofocus="autofocus"></textarea>
    <input type="button" value="send" class="btn btn-send" />
  </div>
</div>

<?php
$sql = "SELECT v_extensions.extension, v_extensions.password FROM v_extensions, v_domains WHERE v_domains.domain_uuid = v_extensions.domain_uuid AND v_domains.domain_name = :domain_name AND v_extensions.extension_uuid = :extension_uuid";
$parameters['domain_name'] = $extension['user_context'];
$parameters['extension_uuid'] = $extension['extension_uuid'];
$database = new database;
$extension_details = $database->select($sql, $parameters, 'row');

$opts = array(
  "server" => $extension['user_context'],
  "username" => $extension_details['extension'],
  "password" => $extension_details['password'],
  "remote_number" => $number,
);

?>
<script src="lib/sip-0.21.2.min.js"></script>
<script type="text/javascript">
  // webpush
  window.notification_data = <?php echo json_encode(array("extension_uuid" => $extension['extension_uuid'], "remote_identifier" => $number)); ?>;

  const channel = new BroadcastChannel('message-pushes');
  channel.onmessage = (event) => {
    if(event.data.from == window.notification_data.remote_identifier) {
      console.log("got message from service worker: ", event.data);
      // pushMessage(event.data.body, "inbound");
    }
  };

  const messageContainer = document.querySelector('.message-container');

  function pushMessage(message, direction) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add("message-" + direction);

    const messageBody = document.createElement('p');
    messageBody.classList.add('message-body');
    messageBody.textContent = message;
    messageDiv.appendChild(messageBody);

    const messageTimestamp = document.createElement('span');
    messageTimestamp.classList.add('timestamp');
    messageTimestamp.dataset.timestamp = moment.utc().format();
    messageTimestamp.textContent = "a few seconds ago";
    messageDiv.appendChild(messageTimestamp);

    wrapper.appendChild(messageDiv);

    messageContainer.appendChild(wrapper);
    messageContainer.scrollTo(0, messageContainer.scrollHeight); // scroll message container to the bottom
  }

  // sipjs
  const opts = <?php echo json_encode($opts); ?>;

  // inbound
  const uaOpts = {
    uri: SIP.UserAgent.makeURI("sip:" + opts.username + "@" + opts.server),
    authorizationUsername: opts.username,
    authorizationPassword: opts.password,
    transportOptions: {
      server: "wss://" + opts.server + ":7443",
    },
    delegate: {
      onInvite: (invitation) => {
        console.log("[INVITE]", invitation);
      },
      onNotify: (notify) => {
        console.log("[NOTIFY]", notify);
      },
      onMessage: (message) => {
        const m = message.incomingMessageRequest.message;
        console.log("[MESSAGE]", m);
        if(m.from.uri.user == opts.remote_number) {
          pushMessage(m.body, 'inbound');
        }
      }
    }
  };
  const userAgent = new SIP.UserAgent(uaOpts);
  const registerer = new SIP.Registerer(userAgent);
  userAgent.start().then(() => {
    registerer.register();
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  });

  // outbound
  const remoteURI = SIP.UserAgent.makeURI("sip:" + opts.remote_number + "@" + opts.server);
  function send() {
    const message = document.querySelector(".textentry").value;
    console.log("sending ", message);
    pushMessage(message, 'outbound');
    const messager = new SIP.Messager(userAgent, remoteURI, message);
    document.querySelector(".textentry").value = "";
    console.log(messager);
    messager.message();
  }

  document.querySelector(".textentry").addEventListener("keypress", (e) => {
    if(e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
      return false;
    }
  });

  document.querySelector(".btn-send").addEventListener("click", send);
</script>
<?php
require_once "footer.php";
