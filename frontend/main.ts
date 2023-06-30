import { createApp } from 'vue';
import { RunSIPConnection } from './lib/SIP';
import Conversation from './components/Conversation.vue';
import { backfillMessages } from './lib/backfill';

type Options = {
    username: string,
    password: string,
    server: string,
    threadName: string,
    extensionUUID: string,
    remoteNumber?: string,
    group?: string,
}

function initializeThreadJS(opts: Options) {
    const app = createApp(Conversation);
    app.config.errorHandler = (err, instance, info) => {
        console.log("error from within vue:", info, err, instance);
        console.error(err);
    }
    app.mount("#conversation");

    backfillMessages(opts.extensionUUID, opts.remoteNumber, opts.group);
    RunSIPConnection(opts.username, opts.password, opts.server);
}

export { initializeThreadJS };
