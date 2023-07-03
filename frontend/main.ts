import { createApp } from 'vue';
import { RunSIPConnection } from './lib/SIP';
import Conversation from './components/Conversation.vue';
import { backfillMessages } from './lib/backfill';
import mitt from 'mitt';

// these are passed to initializeThreadJS from php when initializeThreadJS() is called in thread.php
type Options = {
    username: string,
    password: string,
    server: string,
    threadName: string,
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
    }
    const app = createApp(Conversation, props);

    const emitter = mitt();
    app.config.globalProperties.emitter = emitter;
    app.config.errorHandler = (err, instance, info) => {
        console.log("error from within vue:", info, err, instance);
        console.error(err);
    }

    app.mount("#conversation");

    backfillMessages(opts.extensionUUID, opts.remoteNumber, opts.groupUUID);
    RunSIPConnection(opts.username, opts.password, opts.server, emitter, opts.remoteNumber, opts.groupUUID);
}

export { initializeThreadJS };
