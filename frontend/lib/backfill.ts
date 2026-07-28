import { CPIM } from './CPIM';
import { emitter, state, MessageData } from './global';
import moment from 'moment';

type BackfillResponse = {
    messages: BackfilMessage[],
};

type BackfilMessage = {
    content_type: string,
    direction: string,
    from_number: string,
    group_uuid?: string,
    message: string,
    start_stamp: string,
    to_number: string,
    message_uuid: string,
    delivered?: boolean,
};

type backfillQuery = {
    extension_uuid: string,
    number?: string,
    group?: string,
    older_than?: string,
}

let fetching = false;

export async function backfillMessages(extensionUUID: string, remoteNumber?: string, group?: string) {
    if (fetching) {
        //console.log("[backfill.backfillMessages] skipping duplicate backfill request");
        return;
    }
    fetching = true;
    try {
        let params: backfillQuery = { extension_uuid: extensionUUID };
        let key = remoteNumber ? remoteNumber : group;
        if (remoteNumber) {
            params.number = remoteNumber;
        }

        if (group) {
            params.group = group;
        }
        //if state.conversations[key] exists we have already backfilled at least once
        const stateMessages = state.conversations[key];
        if (stateMessages) {
            if (stateMessages.length > 0 && stateMessages[0].id) {
                params.older_than = stateMessages[0].id;
            }
        }
        else {

        }

        // console.log(params)
        const response: BackfillResponse = await fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString()).then(r => r.json());
        //console.log("[backfill.backfillMessages] received", response.messages, "as backlog");
        if (response.messages) {
            //console.log("[backfill.backfillMessages] received", response.messages.length, "message from backlog");
            for (let i = 0; i < response.messages.length; i++) {
                let m = response.messages[i];
                //console.log(m)
                switch (m.content_type) {
                    case "text/plain":
                        //types
                        insertMessageInHistory(remoteNumber, {
                            direction: m.direction,
                            contentType: m.content_type,
                            timestamp: moment.utc(m.start_stamp),
                            id: m.message_uuid,
                            from: m.from_number,
                            to: m.to_number,
                            body: m.message,
                            delivered: m.delivered,
                        });
                        break;
                    case "message/cpim":
                        if (group) {
                            key = group;
                        }
                        else {
                            key = remoteNumber;
                        }
                        //console.log(`cpim ${m.message}`);
                        insertMessageInHistory(key, {
                            direction: m.direction,
                            contentType: m.content_type,
                            timestamp: moment.utc(m.start_stamp),
                            id: m.message_uuid,
                            from: m.from_number,
                            to: m.to_number,
                            cpim: CPIM.fromString(m.message),
                            delivered: m.delivered,

                        });
                        break;
                }
            }


            fetching = false;
            //console.log('backfill request complete');

            if (response.messages.length == 0) {
                emitter.emit('conversation-fully-backfilled');
            }

        }
        else {
            //console.log("no messages found for ", params);
            emitter.emit('conversation-fully-backfilled');
        }
        emitter.emit('backfill-complete');

    } catch (e) {
        fetching = false;
        //console.log('[backfill.backfillMessages] backfill error:', e);
    }
}

//emits: "update-last-message" w/ message for each message added to history

export function insertMessageInHistory(key: string, message: MessageData) {
    //check for message in history
    //console.log("message", message);
    if (state.conversations[key]) {
        for (let i = 0; i < state.conversations[key].length; i++) {
            //in theory we could also do nothing if the message already exists, we'll update it anyway for now
            state.conversations[key][i] = message;

            return;
        }
        //insert the message where it belongs in the history based on timestamp
        if (state.conversations[key][i].timestamp.isAfter(message.timestamp)) {
            state.conversations[key].splice(i, 0, message);

            return;
        }
    }
    //add a new history if no history is found
    else {
        state.conversations[key] = new Array<MessageData>();
    }
    // message not found in loaded history, append to end    
    state.conversations[key].push(message);
    emitter.emit("update-last-message", message)

}
