import { createApp } from 'vue';
import { RunSIPConnection } from './lib/SIP';
import Conversation from './components/conversation/Conversation.vue'; //remove once initializeThreadListJS works
import ThreadList from './components/ThreadList/ThreadList.vue';
import WebTextingContainer from './components/WebTextingContainer/WebTextingContainer.vue';
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
type ThreadListOptions = {
    username: string,
    password: string,
    server: string,
    extensionUUID: string,
    ownNumber: string,
    threads?: Options[],
}

type WebTextingContainerOptions = {
    username: string,
    password: string,
    server: string,
    extensionUUID: string,
    ownNumber: string,
    threads?: Options[],
    threadName?: string,
    contactEditLink?: string,
    groupMembers?: string[],
    remoteNumber?: string,
    groupUUID?: string,
}
//this is the function used to initalize and deliver the vue app when configured for 1 conversation
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
/* This is going to be where we build and mount the app once it's been configured to run from ThreadLists worklow
*/
function initializeWebTextingContainerJS(opts: ThreadListOptions){
    //how do we want to pass props into threaadlist.
    //in theory threads has to be parsed and sent to each conversation component but is that state or props
    const props={
        ownNumber: opts.ownNumber,
    }
    const app = createApp(WebTextingContainer, props);

    app.config.errorHandler = (err, instance, info) => {
        console.log("error from within vue:", info, err, instance);
        console.error(err);
    }
    app.mount("#WEB_TEXT_ROOT");

    //i think this is stuff that will have to get ported over to threads instead of messages

    //we'll have to backfill for each thread
    backfillMessages(opts.extensionUUID, opts.remoteNumber, opts.groupUUID);
    //i think this needs to stay in conversation mode only but we're doing both
    //that's because we are using webtextingcontainer to deliver both threadlist and conversation side by side
    //so that means we need to mash all the options together and initialize all the components from there.
    //this makse the data flow a little wierd because users will select from threadlist component 
    //we'll have to deliver the information to the container which dispatches the changes to conversation view
    RunSIPConnection(opts.username, opts.password, opts.server, opts.ownNumber, opts.remoteNumber, opts.groupUUID);

    emitter.on('backfill-requested', () => {
        backfillMessages(opts.extensionUUID, opts.remoteNumber, opts.groupUUID);
    })
}

export { initializeThreadJS };
