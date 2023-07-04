import { UserAgentOptions, UserAgent, Registerer, Invitation, Notification, Message, Messager, URI } from 'sip.js';
import { CPIM } from './CPIM';
import { state, emitter, MessageData } from './global';
import moment from 'moment';

let backoff = 0;

function reconnect(userAgent: UserAgent) {
    state.connectivityStatus = "reconnecting";
    if (backoff > 0) {
        state.connectivityStatus = "reconnecting in " + Math.round(backoff) + " seconds";
        setTimeout(() => {
            state.connectivityStatus = "reconnecting";
            userAgent.reconnect().catch(reconnect);
        }, backoff * 1000);
        if (backoff < 30) { // max backoff 30 seconds
            backoff = backoff * 1.1;
        }
    } else {
        state.connectivityStatus = "reconnecting";
        backoff = 2;
        userAgent.reconnect().catch(reconnect);
    }
}

function RunSIPConnection(username: string, password: string, server: string, remote_number?: string, group?: string) {
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
            onConnect: () => {
                state.connectivityStatus = "connected";
            },
            onDisconnect: (err?: Error) => {
                state.connectivityStatus = "disconnected";
                if(err) {
                    console.log("connectivity error:", err)
                }
            },
            onInvite: (invitation: Invitation) => {
                console.log("[INVITE]", invitation);
            },
            onNotify: (notify: Notification) => {
                console.log("[NOTIFY]", notify);
            },
            onMessage: async (message: Message) => {
                console.log("[MESSAGE]", message);
                switch (message.request.getHeader("Content-Type")) {
                    case "text/plain":
                        if (remote_number && message.request.from.uri.user != remote_number) {
                            return;
                        }
                        state.messages.push({
                            direction: 'incoming',
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: message.request.from.uri.user,
                            to: message.request.to.uri.user,
                            body: message.request.body,
                        });
                        emitter.emit('scroll-to-bottom');
                        break;

                    case "message/cpim":
                        let cpim = CPIM.fromString(message.request.body);
                        console.log("Received CPIM ", cpim);

                        if (group && cpim.getHeader("group-uuid") != group) {
                            return
                        }

                        console.log("adding new message to the thread from CPIM");
                        state.messages.push({
                            direction: 'incoming',
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: message.request.from.uri.user,
                            to: message.request.to.uri.user,
                            cpim: cpim,
                        });
                        emitter.emit('scroll-to-bottom');
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
        console.log("ua state change:", s);
        state.connectivityStatus = s;
    });

    const registerer = new Registerer(userAgent, { expires: 30 }); // re-register often because to avoid hitting (nginx) proxy timeouts
    userAgent.start().then(() => {
        registerer.register();
        emitter.emit('scroll-to-bottom');
    }).catch((e) => {
        console.error("error starting: ", e);
        reconnect(userAgent);
    });

    emitter.on('outbound-message', async (message: MessageData) => {
        console.log("outbound message:", message);

        message.timestamp = moment();
        const m = message;
        state.messages.push(m);

        if(message.cpim) {
            message.body = message.cpim.serialize();
        }

        const remoteURI = new URI('sip', message.to, server);
        const messager = new Messager(userAgent, remoteURI, message.body, message.contentType);

        emitter.emit('scroll-to-bottom');

        await messager.message();
    });
}

export { RunSIPConnection };
