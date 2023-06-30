import { UserAgentOptions, UserAgent, Registerer, Invitation, Notification, Message } from 'sip.js';
import { CPIM } from './CPIM';
import { state } from './state';
import moment from 'moment';


function RunSIPConnection(username: string, password: string, server: string) {
    const uaOpts: UserAgentOptions = {
        logBuiltinEnabled: false,
        logConfiguration: false,
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
                console.log("[MESSAGE]", message);
                let body  = message.request.body;
                switch (message.request.getHeader("Content-Type")) {
                    case "text/plain":
                        state.messages.push({
                            direction: 'inbound',
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: message.request.from.uri.user,
                            to: message.request.to.uri.user,
                            body: body,
                        });
                        break;

                    case "message/cpim":
                        let cpim = CPIM.fromString(body);
                        console.log("Received CPIM ", cpim);

                        // if (opts.group_uuid && cpim.headers["group-uuid"]) {
                        //     if (opts.group_uuid != cpim.headers["group-uuid"]) {
                        //         console.log("message is for wrong group, skipping");
                        //         return;
                        //     }
                        // }
                        // console.log("adding new message to the thread from CPIM");
                        break;

                    default:
                        console.log("dropping message with unknown content type ", message.request.getHeader("Content-Type"))
                }
            }
        }
    };

    console.log("initializing user agent with options:", uaOpts);
    const userAgent = new UserAgent(uaOpts);

    userAgent.stateChange.addListener((s) => {
        console.log("ua state change: ", s);
        state.connectivityStatus = s;
    });
    const registerer = new Registerer(userAgent, { expires: 30 }); // re-register often because to avoid hitting (nginx) proxy timeouts
    userAgent.start().then(() => {
        registerer.register();
        //     messageContainer.scrollTo(0, messageContainer.scrollHeight);
        //     document.querySelector('.sendbox > textarea').focus()
    }).catch((e) => {
        console.error("error starting: ", e);
        //     reconnect();
    });
}

export { RunSIPConnection };
