import { createApp } from 'vue';
import { RunSIPConnection } from './lib/SIP';
import Conversation from './components/Conversation.vue';
import { backfillMessages } from './lib/backfill';
import { emitter } from './lib/global';

// these are passed to initializeThreadJS from php when initializeThreadJS() is called in thread.php
type Options = {
    username: string,
    password: string,
    server: string,
    threadName?: string,
    contactEditLink?: string,
    groupMembers?: string[],
    extensionUUID: string,
    ownNumber: string,
    remoteNumber?: string,
    groupUUID?: string,
}

function initializeThreadJS(opts: Options) {
    const props = {
        remoteNumber: opts.remoteNumber,
        groupUUID: opts.groupUUID,
        displayName: opts.threadName,
        ownNumber: opts.ownNumber,
        contactEditLink: opts.contactEditLink,
        groupMembers: opts.groupMembers,
    }
    const app = createApp(Conversation, props);

    app.config.errorHandler = (err, instance, info) => {
        console.log("error from within vue:", info, err, instance);
        console.error(err);
    }

    app.mount("#conversation");

    backfillMessages(opts.extensionUUID, opts.remoteNumber, opts.groupUUID);
    RunSIPConnection(opts.username, opts.password, opts.server, opts.ownNumber, opts.remoteNumber, opts.groupUUID);

    emitter.on('backfill-requested', () => {
        backfillMessages(opts.extensionUUID, opts.remoteNumber, opts.groupUUID);
    })
}

export { initializeThreadJS };
