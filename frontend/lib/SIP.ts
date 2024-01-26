import { UserAgentOptions, UserAgent, Registerer, Invitation, Notification, Message, Messager, URI, RegistererState, TransportState, MessagerOptions } from 'sip.js';
import { CPIM } from './CPIM';
import { state, emitter, MessageData, addMessage } from './global';
import moment from 'moment';
import { compileScript } from 'vue/compiler-sfc';

// nginx timeout is 300 seconds. in testing we can set this to 300 seconds too
// and it will renew a few seconds earlier, but I don't really want to risk it.
// must re-register before the nginx read timeout because registration is the
// closest thing we've got to a keepalive ping
const registrationIntervalSeconds = 270;

let backoff = 0;

function calculatePlainThreadID(message:Message, direction:string, originalTo: string, messageFromUser: string){
    //console.log(`calculatePlainThreadID: ${message}`)
    //console.log(message);

    switch(direction){
        case "incoming":{
            //console.log(`incoming message from ${messageFromUser} to ${originalTo}`)
            return messageFromUser;
        }

        case"outgoing":{
            //console.log(`outgoing message to ${originalTo} from ${messageFromUser}.`)
            return message.to;
        }
    }

    //console.log("do not add")
    return'do not add';
}

function calculateCPIMThreadID(cpim:CPIM, direction:string, originalTo: string, messageFromUser: string){    
    //console.log(`calculateCPIMThreadID ${cpim}`);
    if(cpim.getHeader("group-uuid")) {
        //console.log("message is for a group");
        return cpim.getHeader("group-uuid")
    }
    else if ((originalTo || messageFromUser) ) {
        //console.log(`adding message to conversation between ${originalTo} and ${messageFromUser}.`)
                             //so addMessage it to the correct thread
        return messageFromUser;
    }
    //console.log("do not add")
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
                //console.log("[MESSAGE]", message);
                //console.log(`own number: ${ownNumber}`)
                //I believe this is where we need to target to add auto updatign threadlist
                let direction = 'incoming';
                let originalTo = message.request.getHeader("X-Original-To");
                //console.log(`Message requsetfrom ${message.request.from.uri.user}`)
                if (message.request.from.uri.user == ownNumber) {
                    //console.log("our own message mirrored back to us: ", message.request);
                    direction = 'outgoing'; 
                }
                const messageFromUser = message.request.from.uri.user;
                console.log(message.request.getHeader("Content-Type"));
                switch (message.request.getHeader("Content-Type")) {
                    case "text/plain":

                        const plainThreadID = calculatePlainThreadID(message, direction, originalTo, messageFromUser);
                        addMessage(plainThreadID , {
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
                        console.log("Received CPIM ", cpim);


                        //console.log("adding new message to the thread from CPIM");
                        
                        const cpimThreadID = calculateCPIMThreadID(cpim, direction, originalTo, messageFromUser);
                        console.log(`cpim thread id: ${cpimThreadID}`)
                        addMessage(cpimThreadID ,{
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
                        //console.log("dropping message with unknown content type ", message.request.getHeader("Content-Type"))
                }
            }
        }
    };

    //console.log("initializing user agent with options:", uaOpts);
    const userAgent = new UserAgent(uaOpts);

    userAgent.transport.onDisconnect = (err?: Error) => {
        if(err) {
            //console.log("connectivity error:", err)
        }
    }

    let registerer: Registerer = null;

    userAgent.transport.stateChange.addListener(async (data: TransportState) => {
        //console.log("transport state changeed to", data, "registerer=", registerer);
        switch(data) {
            case TransportState.Connected:
                if(registerer != null) {
                    await registerer.dispose();
                }
                registerer = new Registerer(userAgent, { expires: registrationIntervalSeconds });
                registerer.stateChange.addListener(async (data: RegistererState) => {
                    state.connected = data == RegistererState.Registered;
                    state.connectivityStatus = data;
                    //console.log("registerer state changed to", data, " connected?", state.connected);
                    switch(data) {
                        case RegistererState.Registered:
                            backoff = 0; // reset reconnect backoff timer
                            break;
                        case RegistererState.Unregistered:
                            let registerRequest = await registerer.register();
                            //console.log("sent register request:", registerRequest);
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
        //if plain/text use to number as key
        //if it's cpim 
        addMessage(message.to,m);
        if(message.cpim) {
            message.body = message.cpim.serialize();
            console.log(`serialized cpim message ${message.body}`)
            message.contentType = 'message/cpim';
        }

        const remoteURI = new URI('sip', message.to || message.from, server);
        //console.log(remoteURI)
        let options: MessagerOptions = {extraHeaders: []};
        if(message.id) {
            //console.log(message.id)
            options.extraHeaders.push("X-Message-ID: " + message.id);
        }
        const messager = new Messager(userAgent, remoteURI, message.body, message.contentType, options);
        //console.log(`Messager: `);
        //console.log(messager);
        //console.log(userAgent)
        

        const response = await messager.message();
        //console.log(response);
        //updateLastMessage goes here?
        //emitter.emit('scroll-to-bottom');
    });
}

export { RunSIPConnection };
