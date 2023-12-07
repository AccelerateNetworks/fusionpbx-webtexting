<script lang="ts" >
import ThreadPreview, { ThreadPreviewInterface } from '../ThreadPreview/ThreadPreview.vue';
import {emitter, ThreadChangePayload} from '../../lib/global'

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
        newThreadView: Boolean
    },
    components: { ThreadPreview },
    data() {
        return { activeThread: '' }
    },
    computed: {
        recieveEmit(threadChangeObject:ThreadChangePayload) {
            //console.log(`active conversation: ${activeConversation}`);
            this.activeThread = threadChangeObject.key;
            return this.activeThread;
        }
    },
    mounted(){
        emitter.on('thread-change', (threadChangeObject:ThreadChangePayload) => {
            //console.log("TL event get", activeConversation);
            this.activeThread = threadChangeObject.key;
            return this.activeThread;
        })
    },
}


/*
    get the user extension this is handled in threadlist.php
*/



</script>
<template>

    <div class="threadlist_container active" id="THREADLIST" v-bind:class="(selectedConvo || newThreadView) ? 'hide-if-small': 'no-convo-selected'">
        <div class="threadlist-header">Conversations
            <a id="notification-btn" role="button" class="fas fa-bell-slash fa-fw f" onclick="toggleNotifications()" aria-label="toggle notifications"></a>
        </div>
        <div class='threadlist-table'>
            <div class="preview_list_container">
                <ThreadPreview  v-for="preview in threadPreviews" :key="preview.toString()"
                    v-bind="preview" :activeThread="this.activeThread" />
            </div>
            <div class="link-container">
                <router-link :to="'/createthread.php'" class="thread-link dot" aria-label="new contact">＋</router-link>
            </div>
        </div>
    </div>
</template>
<style>
.float-right{
    position:absolute;
    top: 50%;
    float:right;
}

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
.link-container{
    font-size: 2rem;
    line-height: 2rem;
    height: 3rem;
    width: 3rem;
    background-color: #5f9fd3;
    border-radius: 50%;
    position:relative;
    float: right;
}
.dot {    
    color: white;
    text-align:center;
    margin: 0;
    position: absolute;               /* 2 */
    top: 50%;                         /* 3 */
    left: 50%;
    transform: translate(-50%, -50%) ;

}
.dot:hover{
    color:#BB6025;
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