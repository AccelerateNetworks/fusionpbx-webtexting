import { UserAgentOptions, UserAgent, Registerer, Invitation, Notification, Message, Messager, URI, RegistererState, TransportState, MessagerOptions, MessagerMessageOptions, OutgoingRequestDelegate, IncomingResponse } from 'sip.js';
import { CPIM } from './CPIM';
import { state, emitter, MessageData, addMessage } from './global';
import moment from 'moment';
import { compileScript } from 'vue/compiler-sfc';
import { luaSkip, LuaSkipMessageData } from './SIP_REWORK';
import { AlertData } from '@/components/Alerts/Alert.vue';
// nginx timeout is 300 seconds. in testing we can set this to 300 seconds too
// and it will renew a few seconds earlier, but I don't really want to risk it.
// must re-register before the nginx read timeout because registration is the
// closest thing we've got to a keepalive ping
const registrationIntervalSeconds = 270;

let backoff = 0;
//stolen from https://www.geeksforgeeks.org/javascript/generate-random-alpha-numeric-string-in-javascript/
function randomBytes() {
        return Math.random().toString(36).slice(2);
}


function calculatePlainThreadID(message: Message, direction: string, originalTo: string, messageFromUser: string) {
    switch (direction) {
        case "incoming": {
            return messageFromUser;
        }
        case "outgoing": {
            return originalTo;
        }
    }
    return 'do not add';
}

function calculateCPIMThreadID(cpim: CPIM, direction: string, originalTo: string, messageFromUser: string) {
    if (cpim.headers["Group-UUID"] ) {
        return cpim.headers["Group-UUID"];
    }
    else if ((direction =='incoming')) {
        //not group message and inbound so key is whoever sent message
        return messageFromUser;
    }
    else if (direction =='outgoing') {
        //not group and outbound so key is whoever we send message to
        return originalTo;
    }
    return 'do not add';
}

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

function RunSIPConnection(username: string, password: string, server: string, ownNumber: string,  extension_uuid:string, remote_number?: string, group?: string,) {
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
                if (err) {
                    //console.log("[SIP.RunSIPConnection] connectivity error:", err)
                }
            },
            onMessage: async (message: Message) => {
                let direction = 'incoming';
                let originalTo = message.request.getHeader("X-Original-To");
                if (message.request.from.uri.user == ownNumber) {
                    direction = 'outgoing';
                }
                const messageFromUser = message.request.from.uri.user;
                //console.log(message.request.getHeader("Content-Type"));
                switch (message.request.getHeader("Content-Type")) {
                    case "text/plain":

                        const plainThreadID = calculatePlainThreadID(message, direction, originalTo, messageFromUser);
                        addMessage(plainThreadID, {
                            direction: direction,
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: messageFromUser,
                            to: originalTo,
                            body: message.request.body,
                            id: message.request.getHeader("x-message-id"),
                        });
                        break;

                    case "message/cpim":
                        let cpim = CPIM.fromString(message.request.body);
                        //console.log("[SIP.RunSIPConnection] Received CPIM ", cpim);


                        //console.log("adding new message to the thread from CPIM");

                        const cpimThreadID = calculateCPIMThreadID(cpim, direction, originalTo, messageFromUser);
                        //console.log(`[SIP.RunSIPConnection] cpim thread id: ${cpimThreadID}`)
                        addMessage(cpimThreadID, {
                            direction: direction,
                            contentType: message.request.getHeader("Content-Type"),
                            timestamp: moment(),
                            from: messageFromUser,
                            to: message.request.to.uri.user,
                            cpim: cpim,
                            id: message.request.getHeader("x-message-id"),
                        });
                        break;

                    default:
                        //console.log("[SIP.RunSIPConnection] dropping message with unknown content type ", message.request.getHeader("Content-Type"))
                }
            }
        }
    };
    //console.log("initializing user agent with options:", uaOpts);
    const userAgent = new UserAgent(uaOpts);

    userAgent.transport.onDisconnect = (err?: Error) => {
        if (err) {
            //console.log("connectivity error:", err)
        }
    }

    let registerer: Registerer = null;
    userAgent.transport.stateChange.addListener(async (data: TransportState) => {
        switch (data) {
            case TransportState.Connected:
                if (registerer != null) {
                    await registerer.dispose();
                }
                registerer = new Registerer(userAgent, { expires: registrationIntervalSeconds });
                registerer.stateChange.addListener(async (data: RegistererState) => {
                    state.connected = data == RegistererState.Registered;
                    state.connectivityStatus = data;
                    switch (data) {
                        case RegistererState.Registered:
                            backoff = 0; // reset reconnect backoff timer
                            break;
                        case RegistererState.Unregistered:
                            let registerRequest = await registerer.register();
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
                    let thisBackoff = backoff + Math.round(Math.random() * 5); // add up to 5 seconds to the backoff
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
        //console.log("[SIP.outbound-message] Outbound message:", message);
        message.timestamp = moment();
        const m = message;
        // if plain/text use to number as key
        // if it's cpim 
        if (message.cpim) {
            message.body = message.cpim.serialize();
            message.contentType = 'message/cpim';
        }
        //send message to lua hell
        //or skip lua hell and go straight to outbound-hook.php
        let luaMessage: LuaSkipMessageData = message;
        luaMessage.from_host = server;
        luaMessage.extensionUUID = extension_uuid;

        let luaSkipResponse = await luaSkip(luaMessage);
        //luaSkipResponse = JSON.parse(luaSkipResponse);
        //luaMessage.status = luaSkipResponse.status;
        //luaMessage.statusText = luaSkipResponse.statusText;
        console.log(luaSkipResponse);
        if(luaSkipResponse.statusCode == 200){
            //emitter.emit('message-success', luaSkipResponse);
            console.log('message sent successfully');
        }
        else{
            //console.log('message failed to send');

            emitter.emit('message-failed', luaSkipResponse);
        }
        //add message to state
        if(message.cpim && message.cpim.headers['Group-UUID']){
            const cpimThreadID = calculateCPIMThreadID(message.cpim, message.direction, message.to, message.from);
            addMessage(cpimThreadID, message);
        }
        else{
            addMessage(message.to, message);
        }
    });
}

export { RunSIPConnection };
