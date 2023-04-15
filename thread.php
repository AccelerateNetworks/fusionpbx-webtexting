<?php
/*
	GNU Public License
	Version: GPL 3
*/
require_once "root.php";
require_once "resources/require.php";
require_once "resources/check_auth.php";
require_once "resources/header.php";
require_once "resources/paging.php";

$number = $_GET['number'];
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
    border: solid #999 2px;
    border-radius: 0.5em;
    padding-left: 0.5em;
    padding-right: 0.5em;

    /* stupid hack to get the text entry box to display inside the bounds of the thread */
    display: flex; 
    flex-direction: column;
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
  }

  .textentry {
    margin-bottom: 0.5em;
    border: 0;
    background-color: #eee;
    resize: none; /* prevent the user from resizing the text box */
    flex-grow: 1;
  }

  .btn-send {
    flex-grow: 1;
    max-width: fit-content;
  }

  .textentry:focus {
    outline: none; /* hide the browser's extra focus outline */
  }
</style>

<?php
echo "<div class='action_bar' id='action_bar'>\n";
echo "	<div class='heading'><b>WebTexting - ".$number."</b></div>\n";
echo "	<div class='actions'>\n";
echo button::create(['type'=>'button','label'=>"back",'icon'=>$_SESSION['theme']['button_icon_back'],'id'=>'btn_back','style'=>'margin-right: 15px;','link'=>'index.php']);
echo "	</div>\n";
echo "	<div style='clear: both;'></div>\n";
echo "</div>\n";
echo "<br />\n";
?>
<div class="thread">
<div class="message-container">
  <?php
  $sql = "SELECT * FROM v_sms_messages WHERE extension_uuid = :extension_uuid AND (from_number = :number OR to_number = :number) ORDER BY start_stamp DESC LIMIT 50";
	$parameters['extension_uuid'] = $_SESSION['user']['extension'][0]['extension_uuid'];
	$parameters['number'] = $number;
	$database = new database;
  $messages = $database->select($sql, $parameters, 'all');
  $i = count($messages);
	while($i) {
    $message = $messages[--$i];
    echo "<div class='message-wrapper'>";
    echo "<div class='message message-".$message['direction']."'>".$message['message']."</div>";
    echo "</div>";
  }
	unset($parameters);
  ?>
</div>
<div class="sendbox">
  <textarea class="textentry" autofocus="autofocus"></textarea>
  <input type="button" value="send" class="btn-send" />
</div>
</div>

<?php
if(sizeof($_SESSION['user']['extension']) == 0) {
  echo "<b style='color: red'>no extension for user</b>\n";
}

$sql = "SELECT v_extensions.extension, v_extensions.password FROM v_extensions, v_domains WHERE v_domains.domain_uuid = v_extensions.domain_uuid AND v_domains.domain_name = :domain_name AND v_extensions.extension_uuid = :extension_uuid";
$parameters['domain_name'] = $_SESSION['user']['extension'][0]['user_context'];
$parameters['extension_uuid'] = $_SESSION['user']['extension'][0]['extension_uuid'];
$database = new database;
$extension = $database->select($sql, $parameters, 'row');

if(!$extension) {
  echo "<b style='color: red'>extension ".$_SESSION['user']['extension'][0]['extension_uuid']." not found on domain ".$_SESSION['user']['extension'][0]['user_context']."</b>\n";
}

$opts = array(
  "server" => $_SESSION['user']['extension'][0]['user_context'],
  "username" => $extension['extension'],
  "password" => $extension['password'],
  "remote_number" => $number,
);

?>
<script src="lib/sip-0.21.2.min.js"></script>
<script type="text/javascript">
  const opts = <?php echo json_encode($opts); ?>;

  const messageContainer = document.querySelector('.message-container');
  messageContainer.scrollTo(0, messageContainer.scrollHeight); // scroll message container to the bottom in case there are more messages than fit on the screen

  function pushMessage(message, direction) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message-wrapper");

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add("message-" + direction);
    messageDiv.textContent = message;
    wrapper.appendChild(messageDiv);

    messageContainer.appendChild(wrapper);
    messageContainer.scrollTo(0, messageContainer.scrollHeight); // scroll message container to the bottom
    console.log(messageDiv, wrapper);
  }

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

  document.querySelector(".textentry").addEventListener("keyup", (e) => {
    if(e.key == "Enter" && !e.shiftKey) {
      send();
      return false;
    }
  });

  document.querySelector(".btn-send").addEventListener("click", send);
</script>
<?php
require_once "footer.php";
