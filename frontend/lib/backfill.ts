import { CPIM } from './CPIM';
import { MessageData, emitter, state } from './global';
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
        console.log("skipping duplicate backfill request");
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
        console.log(`backfilling conversations array, ${state.conversations}`)
        console.log(`backfill key: ${key}`)
        //if state.conversations[key] exists we have already backfilled at least once
        const stateMessages = state.conversations[key];
        if(stateMessages){
            if (stateMessages.length > 0 && stateMessages[0].id) {
                params.older_than = stateMessages[0].id;
            }
            //console.log(stateMessages[0])
            //console.log(stateMessages[stateMessages.length-1])
        }
        else{

        }
        
       // console.log(params)
        const response: BackfillResponse = await fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString()).then(r => r.json());
        
        console.log("received", response.messages.length, "message from backlog");
        for (let i = 0; i < response.messages.length; i++) {
            let m = response.messages[i];
            //console.log(m)
            switch (m.content_type) {
                case "text/plain":
                    insertMessageInHistory(remoteNumber,{
                        direction: m.direction,
                        contentType: m.content_type,
                        timestamp: moment.utc(m.start_stamp),
                        id: m.message_uuid,
                        from: m.from_number,
                        to: m.to_number,
                        body: m.message,
                    });
                    break;
                case "message/cpim":
                    if(group){
                        key = group;
                    }                    
                    else{
                        key = remoteNumber;
                    }
                    //console.log(`cpim ${m}`);
                    insertMessageInHistory(key,{
                        direction: m.direction,
                        contentType: m.content_type,
                        timestamp: moment.utc(m.start_stamp),
                        id: m.message_uuid,
                        from: m.from_number,
                        to: m.to_number,
                        cpim: CPIM.fromString(m.message),
                    });
                    break;
            }
        }

        fetching = false;
        //console.log('backfill request complete');

        if (response.messages.length == 0) {
            emitter.emit('conversation-fully-backfilled');
        }
        emitter.emit('backfill-complete');
    } catch (e) {
        fetching = false;
        console.log('backfill error:', e);
    }
}

export function insertMessageInHistory(key:string, message: MessageData) {
    //check for message in history
    if(state.conversations[key]){
        for (let i = 0; i < state.conversations[key].length; i++) {
            if (state.conversations[key][i].id == message.id) {
                state.conversations[key][i] = message;
                return;
            }
    
            if (state.conversations[key][i].timestamp.isAfter(message.timestamp)) {
                state.conversations[key].splice(i, 0, message);
                return;
            }
        }
    }
    //add a new history if no history is found
    else{
        state.conversations[key] = new Array<MessageData>();
    }
    // no existing message matched, append to end    
    state.conversations[key].push(message);
    //console.log("after:", state.conversations[key]);
}
