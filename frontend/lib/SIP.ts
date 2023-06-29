import { UserAgentOptions, UserAgent, Registerer, Invitation, Notification, Message } from 'sip.js';
import moment from 'moment';


function InitializeSIP(username: string, password: string, server: string) {
    const uaOpts: UserAgentOptions = {
        uri: UserAgent.makeURI("sip:" + username + "@" + server),
        authorizationUsername: username,
        authorizationPassword: password,
        transportOptions: {
            server: "wss://" + server + "/ws",
            headerProtocol: "WS",
        },
        delegate: {
            onInvite: (invitation: Invitation) => {
                console.log("[INVITE]", invitation);
            },
            onNotify: (notify: Notification) => {
                console.log("[NOTIFY]", notify);
            },
            onMessage: (message: Message) => {
                // const m = message.incomingMessageRequest.message;
                console.log("[MESSAGE]", message);

                // switch (m.headers["Content-Type"][0].raw) {
                //     case "text/plain":
                //         pushMessage(m.body, 'inbound');
                //         break;
                //     case "message/cpim":
                //         let cpim = CPIM.fromString(m.body);
                //         console.log("Received CPIM ", cpim);

                //         if (opts.group_uuid && cpim.headers["group-uuid"]) {
                //             if (opts.group_uuid != cpim.headers["group-uuid"]) {
                //                 console.log("message is for wrong group, skipping");
                //                 return;
                //             }
                //         }

                //         console.log("adding new message to the thread from CPIM");

                //         break;
                // }
            }
        }
    };
    console.log("initializing user agent with options:", uaOpts);
    const userAgent = new UserAgent(uaOpts);
    userAgent.stateChange.addListener((s) => console.log("ua state change: ", s));
    const registerer = new Registerer(userAgent, { expires: 30 }); // re-register often because to avoid hitting (nginx) proxy timeouts
    userAgent.start().then(() => {
        registerer.register();
        //     messageContainer.scrollTo(0, messageContainer.scrollHeight);
        //     document.querySelector('.sendbox > textarea').focus()
    }).catch((e) => {
        console.error("error starting: ", e);
        //     reconnect();
        moment();
    });
}

export { InitializeSIP };
