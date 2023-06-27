// webpush
const channel = new BroadcastChannel('message-pushes');
channel.onmessage = (event) => {
  if (event.data.from == window.notification_data.remote_identifier) {
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
let backoff = 0;

// inbound
const uaOpts = {
  uri: SIP.UserAgent.makeURI("sip:" + opts.username + "@" + opts.server),
  authorizationUsername: opts.username,
  authorizationPassword: opts.password,
  transportOptions: {
    server: "wss://" + window.location.hostname + "/ws",
    headerProtocol: "WS",
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
      
      // if the thread is a one-on-one conversation and the incoming message isn't from the remote user we're on the page for, discard
      if(opts.remote_number) {
        if(m.from.uri.user != opts.remote_number) {
          return;
        }
      }

      switch(m.headers["Content-Type"][0].raw) {
      case "text/plain":
          pushMessage(m.body, 'inbound');
        break;
      case "message/cpim":
        let cpim = CPIM.fromString(m.body);
        console.log("Received CPIM ", cpim);
        
        if(opts.group_uuid && cpim.headers["group-uuid"]) {
          if(opts.group_uuid != cpim.headers["group-uuid"]) {
            console.log("message is for wrong group, skipping");
            return;
          }
        }

        console.log("adding new message to the thread from CPIM");

        break;
      }
    }
  }
};

const userAgent = new SIP.UserAgent(uaOpts);
userAgent.stateChange.on((s) => console.log("ua state change: ", s))

function reconnect() {
  let statusbox = document.querySelector('.statusbox');
  if (backoff > 0) {
    if (statusbox) {
      statusbox.textContent = "reconnecting in " + Math.round(backoff) + " seconds";
    }
    setTimeout(() => {
      console.log('reconnecting');
      if (statusbox) {
        statusbox.textContent = "reconnecting";
      }
      userAgent.reconnect().catch(reconnect);
    }, backoff * 1000);
    if (backoff < 30) { // max backoff 30 seconds
      backoff = backoff * 1.1;
    }
  } else {
    if (statusbox) {
      statusbox.textContent = "reconnecting";
    }
    backoff = 2;
    console.log('reconnecting');
    userAgent.reconnect().catch(reconnect);
  }
}

userAgent.onTransportConnect = () => {
  let btn = document.querySelector('.btn-send');
  if (btn) {
    btn.disabled = false;
  }
  let statusbox = document.querySelector('.statusbox');
  if (statusbox) {
    statusbox.textContent = "connected";
    statusbox.classList.remove('error');
  }

  backoff = 0;
};
userAgent.onTransportDisconnect = (error) => {
  let btn = document.querySelector('.btn-send');
  if (btn) {
    btn.disabled = true;
  }
  let statusbox = document.querySelector('.statusbox');
  if (statusbox) {
    statusbox.classList.add('error');
  }
  reconnect();
}

const registerer = new SIP.Registerer(userAgent, { expires: 30 }); // re-register often because to avoid hitting (nginx) proxy timeouts
userAgent.start().then(() => {
  registerer.register();
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
  document.querySelector('.sendbox > textarea').focus()
}).catch((e) => {
  console.error("error starting: ", e);
  reconnect();
});

// outbound
const attached = new Array();
const remoteURI = SIP.UserAgent.makeURI("sip:" + opts.remote_number + "@" + opts.server);

function send() {
  const message = document.querySelector(".textentry").value.trim();
  if (message.length == 0 && attached.length == 0) {
    document.querySelector('.sendbox > textarea').focus();
    return;
  }

  console.log("sending ", message, " with ", attached.length, " attachment(s)");
  pushMessage(message, 'outbound');
  const messager = new SIP.Messager(userAgent, remoteURI, message);
  document.querySelector(".textentry").value = "";
  console.log(messager);
  messager.message();
}

document.querySelector(".textentry").addEventListener("keypress", (e) => {
  if (e.key == "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
    return false;
  }
});

async function uploadAttachment(file, wrapper) {
  const uploadTarget = await fetch("upload.php", {
    method: "POST",
    body: JSON.stringify({ filename: file.name })
  }).then(r => r.json());

  console.log("uploading ", uploadTarget);
  const resp = await fetch(uploadTarget.upload_url, {
    method: "PUT",
    body: await file.arrayBuffer(),
  });

  console.log("uploaded: ", resp);

  return uploadTarget.path;
}

function attach() {
  for (const file of this.files) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('attachment-preview-wrapper')

    const img = document.createElement('img');
    img.classList.add('attachment-preview-img');
    img.src = URL.createObjectURL(file);

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('fas', 'fa-trash', 'fa-fw');

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    document.querySelector('.attachment-preview').appendChild(wrapper);

    attached.push({
      file: file,
      preview: wrapper,
      upload: uploadAttachment(file, wrapper),
    });
  }
}

document.querySelector(".btn-send").addEventListener("click", send);
document.querySelector("#attachment-upload").addEventListener("change", attach)
