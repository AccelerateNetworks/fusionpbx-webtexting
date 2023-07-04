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

let active = false;

export async function backfillMessages(extensionUUID: string, remoteNumber?: string, group?: string) {
    if (active) {
        console.log("skipping duplicate backfill request");
        return;
    }

    active = true;
    try {
        let params: backfillQuery = { extension_uuid: extensionUUID };

        if (remoteNumber) {
            params.number = remoteNumber;
        }

        if (group) {
            params.group = group;
        }

        if (state.messages.length > 0 && state.messages[0].id) {
            params.older_than = state.messages[0].id;
        }

        const response: BackfillResponse = await fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString()).then(r => r.json());

        console.log("received", response.messages.length, "message from backlog");
        for (let i = 0; i < response.messages.length; i++) {
            let m = response.messages[i];
            switch (m.content_type) {
                case "text/plain":
                    insertMessageInHistory({
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
                    insertMessageInHistory({
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

        active = false;
        console.log('backfill request complete');

        if (response.messages.length == 0) {
            emitter.emit('conversation-fully-backfilled');
        }
        emitter.emit('backfill-complete');
    } catch (e) {
        active = false;
        console.log('backfill error:', e);
    }
}

function insertMessageInHistory(message: MessageData) {
    for (let i = 0; i < state.messages.length; i++) {
        if (state.messages[i].id == message.id) {
            state.messages[i] = message;
            return;
        }

        if (state.messages[i].timestamp.isAfter(message.timestamp)) {
            state.messages.splice(i, 0, message);
            return;
        }
    }

    // no existing message matched, append to end
    state.messages.push(message);
}
