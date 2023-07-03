import { CPIM } from './CPIM';
import { MessageData, state } from './state';
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
};

type backfillQuery = {
    extension_uuid: string,
    number?: string,
    group?: string,
}

export function backfillMessages(extensionUUID: string, remoteNumber?: string, group?: string) {
    let params: backfillQuery = {extension_uuid: extensionUUID};

    if(remoteNumber) {
        params.number = remoteNumber;
    }

    if(group) {
        params.group = group;
    }

    fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString()).then(r => r.json()).then((response: BackfillResponse) => {
        console.log("received", response.messages.length, "message from backlog");
        response.messages.forEach((m) => {
            switch(m.content_type) {
                case "text/plain":
                    state.messages.unshift({
                        direction: m.direction,
                        contentType: m.content_type,
                        timestamp: moment.utc(m.start_stamp),
                        from: m.from_number,
                        to: m.to_number,
                        body: m.message,
                    })
                    break
                case "message/cpim":
                    state.messages.unshift({
                        direction: m.direction,
                        contentType: m.content_type,
                        timestamp: moment.utc(m.start_stamp),
                        from: m.from_number,
                        to: m.to_number,
                        cpim: CPIM.fromString(m.message),
                    })
            }
        });
    })
}
