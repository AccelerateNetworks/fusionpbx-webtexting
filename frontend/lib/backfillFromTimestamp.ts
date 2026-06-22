import { CPIM } from './CPIM';
import { emitter, state, MessageData } from './global';
import moment from 'moment';
import { insertMessageInHistory } from './backfill';

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

type backfillFromTimestampQuery = {
    extension_uuid: string,
    number?: string,
    group?: string,
    younger_than?: string,
}

let updating = false;

export async function backfillFromTimestamp(extensionUUID: string, timestamp: string, remoteNumber?: string | undefined, group?: string | undefined) {
    if (updating) {
        console.log("[backfill.fromTimestamp] skipping duplicate backfill request");
        return;
    }
    updating = true;
    try {
        let params: backfillFromTimestampQuery = { extension_uuid: extensionUUID };
        //if state.conversations[key] exists we have already backfilled at least once
        params.younger_than = state.currentSessionStartTime;
        //params.younger_than = "2026-03-30T21:17:49.686Z";

        //console.log(params.younger_than)


        // console.log(params)
        const response: BackfillResponse = await fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString()).then(r => r.json());
        console.log("[backfill.backfillMessages] received", response, "as backlog");
        if (response.messages) {
            let key;
            console.log("[backfill.backfillMessages] received", response.messages.length, "message from backlog");
            for (let i = 0; i < response.messages.length; i++) {
                let m = response.messages[i];
                console.log(m)
                switch (m.content_type) {
                    case "text/plain":
                        //types
                        if (m.direction === 'incoming') {
                            insertMessageInHistory(m.from_number, {
                                direction: m.direction,
                                contentType: m.content_type,
                                timestamp: moment.utc(m.start_stamp),
                                id: m.message_uuid,
                                from: m.from_number,
                                to: m.to_number,
                                body: m.message,
                                delivered: m.delivered,
                            });
                        }
                        else {
                            insertMessageInHistory(m.to_number, {
                                direction: m.direction,
                                contentType: m.content_type,
                                timestamp: moment.utc(m.start_stamp),
                                id: m.message_uuid,
                                from: m.from_number,
                                to: m.to_number,
                                body: m.message,
                                delivered: m.delivered,
                            });
                        }
                        break;
                    case "message/cpim":
                        if (m.group_uuid) {
                            key = m.group_uuid;
                        }
                        else if (m.direction === 'incoming') {
                            console.log(m.from_number, ' = m.from_number');
                            if (m.from_number) {
                                key = m.from_number;
                                console.log(key, ' = key for conversation (remoteNumber)');

                            }
                            else {
                                key = m.to_number;
                                console.log(key, ' = key for conversation (to_number)');

                            }
                            console.log(key, ' = key for conversation');
                        }
                        else {
                            console.log("no key found for message", m);
                            key = 'unknown';
                        }

                        console.log(`cpim ${m.message}`);
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



            //console.log('backfill request complete');

            if (response.messages.length == 0) {
                //emitter.emit('conversation-fully-backfilled');
                console.log("no new messages past ", state.currentSessionStartTime);
            }
            else {
                emitter.emit('last-checked-timestamp', new Date(Date.now()).toISOString());
            }
        }
        else {
            //console.log("no messages found for ", params);
            //emitter.emit('conversation-fully-backfilled');
        }
        emitter.emit('backfill-poll-complete');

    } catch (e) {
        updating = false;
        console.log('[backfill.backfillMessages] backfill error:', e);
    }
    updating = false;
    //console.log("done updating timestamp");
}