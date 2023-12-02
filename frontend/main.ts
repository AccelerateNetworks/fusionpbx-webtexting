import {  createApp } from 'vue';
import {createWebHistory, createRouter, RouteRecordRaw, RouterViewProps, RouterView} from 'vue-router';
import {router} from './routes';
import { RunSIPConnection } from './lib/SIP';
import WebTextingContainer from './components/WebTextingContainer/WebTextingContainer.vue';
import { backfillMessages } from './lib/backfill';
import { emitter } from './lib/global';

// these are passed to initializeThreadJS from php when initializeThreadJS() is called in thread.php
type ThreadOptions = {
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
    threads?: Object[],
}

type WebTextingContainerOptions = {
    username: string,
    password: string,
    server: string,
    extensionUUID: string,
    ownNumber: string,
    threads?: ThreadListOptions[],
    $thread_preview_opts: Object[],
    displayName?: string,
    contactEditLink?: string,
    groupMembers?: string[],
    remoteNumber?: string,
    groupUUID?: string,
    refreshLink?: string,
}

/* This is going to be where we build and mount the app once it's been configured to run from ThreadLists worklow
*/
export const initializeWebTextingContainer = function initializeWebTextingContainerJS(opts: WebTextingContainerOptions){
    //how do we want to pass props into threaadlist.
    //in theory threads has to be parsed and sent to each conversation component but is that state or props
    const containerProps={
        remoteNumber: opts.remoteNumber,
        groupUUID: opts.groupUUID,
        displayName: opts.username,
        ownNumber: opts.ownNumber,
        contactEditLink: opts.contactEditLink,
        groupMembers: opts.groupMembers,
        threads: opts.threads,
        threadPreviews: opts.$thread_preview_opts
    }
    //console.log(opts)
    //console.log("props", containerProps)
    const app = createApp(WebTextingContainer, containerProps);
    
    app.config.errorHandler = (err, instance, info) => {
        console.log("error from within vue:", info, err, instance);
        console.error(err);
    }
    app.use(router);
    app.mount("#TEST_DIV_FOR_TESTING_WEBTEXTING");

    RunSIPConnection(opts.username, opts.password, opts.server, opts.ownNumber, opts.remoteNumber, opts.groupUUID);

    emitter.on('backfill-requested', (key:string) => {
        console.log(`main.ts backfill key ${key}`)
        //key is either a uuid or phone number. uuid length is at least 16
        if(key){
            if(key.length<15){
                console.log(`backfill using remotenumber: ${key}`)
                backfillMessages(opts.extensionUUID, key, null);
            }
            else{
                console.log(`backfill using group ${key}`)
                backfillMessages(opts.extensionUUID, null, key);
            }
        }
        else{
            console.log("ignoring backfill request with no key");
        }
        
    })
}

