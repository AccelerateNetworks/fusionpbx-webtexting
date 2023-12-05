<script lang="ts" >
import ThreadPreview, { ThreadPreviewInterface } from '../ThreadPreview/ThreadPreview.vue';
import {emitter} from '../../lib/global'

// type ThreadListInterface = {

//     username: String,
// }


export default {
    name: 'ThreadList',

    props: {
        displayName: String,
        ownNumber: String,
        threads: Array<Object>,
        threadPreviews: Array<ThreadPreviewInterface>,
        selectedConvo: Boolean,
    },
    components: { ThreadPreview },
    data() {
        return { activeThread: '' }
    },
    computed: {
        recieveEmit(activeConversation) {
            //console.log(`active conversation: ${activeConversation}`);
            this.activeThread = activeConversation;
            return this.activeThread;
        }
    },
    mounted(){
        emitter.on('thread-change', (activeConversation: String) => {
            //console.log("TL event get", activeConversation);
            this.activeThread = activeConversation;
            return this.activeThread;
        })
    },
}


/*
    get the user extension this is handled in threadlist.php
*/



</script>
<template>

    <div class="threadlist_container active" id="THREADLIST" v-bind:class="selectedConvo ? 'hide-if-small': 'no-convo-selected'">

            <div class="threadlist-header">Conversations
                <router-link :to="'/createthread.php'" class="thread-link" >New contact</router-link>
            </div>

        <div class='threadlist-table'>
            
            <div class="preview_list_container">
                <ThreadPreview  v-for="preview in threadPreviews" :key="preview.toString()"
                    v-bind="preview" :activeThread="this.activeThread" />
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
                    <div class="tr_replace inactiveThread" last_message="[object Object]"><div class="td_preview inactiveThread"><a href="/app/webtexting/thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161" class="thread-link"><div class="thread-preview-container inactiveThread"><span class="thread-name inactiveThread">12063801161</span><span class="timestamp inactiveThread" data-timestamp="2023-11-29 22:45:09.679273">5 days ago</span><span class="thread-last-message inactiveThread">MMS message</span></div></a></div></div>
            </div>
        </div>
    </div>
</template>
<style>

.active{
    grid-column-start: 1;
}
.preview_list_container {
    direction: ltr;
    padding-left: 0.25rem;
}



.threadlist_container {
    height: 100%;
    grid-column-start: 1;
    grid-column-end: 1;
    padding-right: 0.25rem;
    border-radius: 0.5rem;
    border-color: none;
}
.hide-if-small{
}

.threadlist-header{
    box-shadow: 0 4px 4px -2px white;
    margin: 0 auto 3px auto;
    padding: 1em;
    background-color: #5f9fd3;
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
    border: solid #5f9fd3 2px;
}

.threadlist-table {
    /*border-spacing: 1em; */
    direction: rtl;
    overflow-y: auto;
    height: 80vh;
    width: 100%;
    table-layout: fixed;
    
}


    @media screen and (width <=700px) {    
    div.action_bar {
        top: 0px;
    }
    .active{
        z-index:7;
    }
    .table {
        height: 80vh;
    }
    .hide-if-small{
        display:none;
    }
}
</style>