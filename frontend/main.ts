import { createApp } from 'vue';
import { InitializeSIP } from './lib/SIP';
import Conversation from './components/Conversation.vue';

type Options = {
    username: string,
    password: string,
    server: string,
    threadName: string,
}

function initializeThreadJS(opts: Options) {
    InitializeSIP(opts.username, opts.password, opts.server);
    const app = createApp(Conversation);
    app.config.errorHandler = (err, instance, info) => {
        console.log("error from within vue:", info, err, instance);
        console.error(err);
    }
    app.mount("#conversation");
}

export { initializeThreadJS };
