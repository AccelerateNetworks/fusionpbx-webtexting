import { UserAgentOptions, UserAgent, Registerer, Invitation, Notification, Message, Messager, URI, RegistererState, TransportState, MessagerOptions } from 'sip.js';
import { CPIM } from './CPIM';
import { state, emitter, MessageData, addMessage } from './global';
import moment from 'moment';

// nginx timeout is 300 seconds. in testing we can set this to 300 seconds too
// and it will renew a few seconds earlier, but I don't really want to risk it.
// must re-register before the nginx read timeout because registration is the
// closest thing we've got to a keepalive ping
const registrationIntervalSeconds = 270;

let backoff = 0;

function reconnect(userAgent: UserAgent) {
    state.connected = false;
    state.connectivityStatus = "reconnecting";
    if (backoff > 0) {
        state.connectivityStatus = "reconnecting in " + Math.round(backoff) + " seconds";
        setTimeout(() => {
            state.connectivityStatus = "reconnecting";
            userAgent.reconnect().catch(() => reconnect(userAgent));
        }, backoff * 1000);
        if (backoff < 30) { // max backoff 30 seconds
            backoff = backoff * 1.1;
        }
    } else {
        state.connectivityStatus = "reconnecting";
        backoff = 2;
        userAgent.reconnect().catch(() => reconnect(userAgent));
    }
}

function RunSIPConnection(username: string, password: string, server: string, ownNumber: string, remote_number?: string, group?: string) {
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
            // onInvite: (invitation: Invitation) => {
            //     console.log("[INVITE]", invitation);
            // },
            // onNotify: (notify: Notification) => {
            //     console.log("[NOTIFY]", notify);
            // },
            onMessage: async (message: Message) => {
                console.log("[MESSAGE]", message);

                let direction = 'incoming';
                let originalTo = message.request.getHeader("X-Original-To");
                if (message.request.from.uri.user == ownNumber) {
                    console.log("our own message mirrored back to us: ", message.request);
                    direction = 'outgoing';
                }

                switch (message.request.getHeader("Content-Type")) {
                    case "text/plain":
                        if (!remote_number) {
                            // text/plain messages cannot be sent to groups, they are always MMSs
                            console.log("skipping non-group message");
                            return;
                        }

                        if ((originalTo || message.request.from.uri.user) != remote_number) {
                            console.log("message not from current thread: ", originalTo || message.request.from.uri.user, "!=", remote_number)
                            return;
                        }

                        addMessage({
                            direction: direction,
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: message.request.from.uri.user,
                            to: originalTo,
                            body: message.request.body,
                            id: message.request.getHeader("x-message-id"),
                        });
                        break;

                    case "message/cpim":
                        let cpim = CPIM.fromString(message.request.body);
                        console.log("Received CPIM ", cpim);

                        if (group) {
                            if(cpim.getHeader("group-uuid") != group) {
                                console.log("message is not for this group");
                                return
                            }
                        } else if (cpim.getHeader("group-uuid")) {
                            console.log("message is for a group, current thread is not a group")
                            return;
                        } else if ((originalTo || message.request.from.uri.user) != remote_number) {
                            console.log("message not from current thread: ", originalTo || message.request.from.uri.user, "!=", remote_number)
                            return;
                        }

                        console.log("adding new message to the thread from CPIM");
                        addMessage({
                            direction: direction,
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: message.request.from.uri.user,
                            to: message.request.to.uri.user,
                            cpim: cpim,
                            id: message.request.getHeader("x-message-id"),
                        });
                        break;

                    default:
                        console.log("dropping message with unknown content type ", message.request.getHeader("Content-Type"))
                }
            }
        }
    };

    console.log("initializing user agent with options:", uaOpts);
    const userAgent = new UserAgent(uaOpts);

    userAgent.transport.onDisconnect = (err?: Error) => {
        if(err) {
            console.log("connectivity error:", err)
        }
    }

    let registerer: Registerer = null;

    userAgent.transport.stateChange.addListener(async (data: TransportState) => {
        console.log("transport state changeed to", data, "registerer=", registerer);
        switch(data) {
            case TransportState.Connected:
                if(registerer != null) {
                    await registerer.dispose();
                }
                registerer = new Registerer(userAgent, { expires: registrationIntervalSeconds });
                registerer.stateChange.addListener(async (data: RegistererState) => {
                    state.connected = data == RegistererState.Registered;
                    state.connectivityStatus = data;
                    console.log("registerer state changed to", data, " connected?", state.connected);
                    switch(data) {
                        case RegistererState.Registered:
                            backoff = 0; // reset reconnect backoff timer
                            break;
                        case RegistererState.Unregistered:
                            let registerRequest = await registerer.register();
                            console.log("sent register request:", registerRequest);
                            break;
                    }
                });
                await registerer.register();
                emitter.emit('scroll-to-bottom');
                break;
            case TransportState.Connecting:
                state.connected = false;
                state.connectivityStatus = "connecting";
                break;
            case TransportState.Disconnecting:
                break;
            case TransportState.Disconnected:
                if (backoff > 0) {
                    let thisBackoff = backoff + Math.round(Math.random()*5); // add up to 5 seconds to the backoff
                    state.connectivityStatus = "reconnecting in " + Math.ceil(thisBackoff) + " seconds";
                    let interval = setInterval(() => {
                        state.connectivityStatus = "reconnecting in " + Math.floor(thisBackoff--) + " seconds";
                    }, 1000);
                    setTimeout(() => {
                        clearInterval(interval);
                        state.connectivityStatus = "reconnecting";
                        userAgent.reconnect();
                    }, thisBackoff * 1000);
                    if (backoff < 60) { // max backoff 60 seconds
                        backoff = backoff * 1.1;
                    }
                } else {
                    state.connectivityStatus = "reconnecting";
                    backoff = 2;
                    userAgent.reconnect();
                }
                break;
        }
    })

    window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
        registerer.unregister();
    });

    userAgent.start();

    emitter.on('outbound-message', async (message: MessageData) => {
        console.log("outbound message:", message);

        message.timestamp = moment();
        const m = message;
        addMessage(m);

        if(message.cpim) {
            message.body = message.cpim.serialize();
            message.contentType = 'message/cpim';
        }

        const remoteURI = new URI('sip', message.to || message.from, server);
        let options: MessagerOptions = {extraHeaders: []};
        if(message.id) {
            options.extraHeaders.push("X-Message-ID: " + message.id);
        }
        const messager = new Messager(userAgent, remoteURI, message.body, message.contentType, options);

        emitter.emit('scroll-to-bottom');

        await messager.message();
    });
}

export { RunSIPConnection };
