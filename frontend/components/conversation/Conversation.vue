<script lang="ts">

import { MessageData, emitter, state } from '../../lib/global';
import {CPIM} from '../../lib/CPIM'
import {ref } from "vue";
import {backfillMessages} from '../../lib/backfill';
import Message from '../message/Message.vue';
import moment from 'moment';
import SendBox from '../SendBox/SendBox.vue';
let fetchingActive = false;
interface TestURLParams{
    extension_uuid: String,
    number?: String
}
interface ConversationProps{
    extension_uuid:String,
            number?:String,
            group?: String
}
type MessageBundle = {
    messages: MessageData[]
}
type MessageQuery={
    extension_uuid: string,
    number?: string,
    group?: string,
    older_than?: string,
}

const  getMessages = async (queryParams: MessageQuery) => {
    if(fetchingActive){
        //console.log("skipping duplicate message fetches");
        return;
    }
    fetchingActive = true;
    try{
        let params:MessageQuery = {
            extension_uuid: queryParams.extension_uuid
        }
        if(queryParams.number){
            params.number = queryParams.number
            //emitter.emit('backfill-requested',params.number);
        }
        if(queryParams.group){
            params.group = queryParams.group
            //emitter.emit('backfill-requested',params.group);
        }
        let key ='';
        //console.log(params);
        let r =  await fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString());
        let response:MessageBundle = await r.json();

        //console.log(`getMessages message response ${response.messages}`)
        response.messages = response.messages.reverse();
        for(let i = 0 ; i < response.messages.length ; i++){
            let m = response.messages[i];
            m.timestamp =  moment.utc(m.start_stamp);
            //console.log(m);
            switch (m.content_type){
                case "message/cpim":
                    m.cpim = CPIM.fromString(m.message)
            }
            if(m.group_uuid){
                key = m.group_uuid;
            }
            else{
                //outgoing for 2P conversation
                if(m.to_number == queryParams.number){
                    key = m.to_number
                }
                else{
                    key = m.from_number
                }
            }
            
        }
        
        fetchingActive = false;
        return response.messages;
    }
    catch(e){
        fetchingActive = false;
        //console.log("error retrieving messages", e)
    }
    
}
    export default {
    name: 'convo',    
    props: {
        extension_uuid:{
            type:String,
        },
        remoteNumber: {
            type: String,
        },
        groupUUID: {
            type: String,
        },
        displayName: {
            type: String,
        },
        ownNumber: {
            type: String,
            required: true,
        },
        contactEditLink: {
            type: String,
        },
        groupMembers: {
            type: Array<String>,
        }
    },
    components :{Message, SendBox},
    async setup(props){
        const initialQueryParams= <MessageQuery>({ extension_uuid: props.extension_uuid,
                number: props.remoteNumber });
        //const messages =  await getMessages(initialQueryParams);
        if(props.remoteNumber){
            //emitter.emit('backfill-requested',props.remoteNumber);
        }
        else if(props.groupUUID){
            //emitter.emit('backfill-requested',props.groupUUID);
        }
        
        //console.log(`setup ${messages}`);
        
    },
     data() {

        let title = "";
        if(this.displayName) {
            title = this.displayName;
        } else if(this.groupMembers) {
            title = this.groupMembers.join(", ");
        }

        if(this.remoteNumber) {
            if(title.length > 0) {
                title += " (" + this.remoteNumber + ")";
            } else {
                title += this.remoteNumber;
            }
        }
        let conversationKey = this.remoteNumber? this.remoteNumber : this.groupUUID;
        return {
            bottomVisible: true,
            topVisible: false,
            backfillAvailable: true,
            state: state,
            enteredText: "",
            pendingAttachment: null,
            atBottom: true,
            title: title,
            conversationKey: conversationKey,
            messages: new Array<MessageData>
        };
    },

    mounted() {
        if(this.$route.query.number){
            //backfillMessages(this.$route.query.extension_uuid, this.$route.query.number);
        }
        else if(this.props.groupUUID){
            //backfillMessages(this.$route.query.extension_uuid, this.props.groupUUID);
        }
        
        emitter.on('scroll-to-bottom', this.toBottom);

        let observer = new IntersectionObserver(this.onObserve, {
            root: this.$refs.message_container,
            rootMargin: "0px",
            threshold: 0.5,
        });
        observer.observe(this.$refs.top);
        observer.observe(this.$refs.bottom);

        emitter.on('backfill-complete', () => {
            if (!this.backfillAvailable) {
                //console.log('conversation fully backfilled, refusing to attempt to backfill more');
                return;
            }

            if (this.topVisible && this.bottomVisible) {
                console.log('top and bottom of conversation visible, attempting to backfill immediately');
                emitter.emit('backfill-requested',this.conversationKey);
                return;
            }

            //console.log('will backfill if top is still visible in 1 second');
            setTimeout(() => {
                if (this.topVisible) {
                    console.log("top still visible backfill")
                    emitter.emit('backfill-requested',this.conversationKey);
                }
            }, 5000);
        });

        emitter.on('conversation-fully-backfilled', () => {
            //console.log('preventing future backfilling attempts, this conversation has been fully backfilled');
            this.backfillAvailable = false;
        })
        //console.log(this.state.messages);
        //console.log("Conversation.vue mounted with props:\nremoteNumber:", this.remoteNumber, "\ngroupUUID:", this.groupUUID, "\ndisplayName:", this.displayName, "\nownNumber:", this.ownNumber);
    },
    beforeUpdate() {
        this.backfillAvailable=true;
    },
    watch:{
        remoteNumber: async function (rN) {
            this.title= rN;
            this.messages=[];
            //console.log(rN);
            //console.log("remote number changed changing this.messages")
            if(this.remoteNumber) {
                
                //console.log("no");
                if(this.state.conversations[rN]){
                    //conversation found
                    //console.log("conversation found skipping fetch")
                    this.messages = this.state.conversations[rN];
                }
                else{
                    const observedRemoteNumberChangeQueryParams= <MessageQuery>({ extension_uuid: this.$route.query.extension_uuid,
                number: rN });
                    //this.state.conversations[rN] = await this.fetchInitialMessages();
                    this.messages = this.state.conversations[rN];
                }
                this.conversationKey=rN;
                //emitter.emit("backfill-requested",rN)
                //console.log(observedChangeQueryParams)
                
            }
            else{
                //console.log(`this.remoteNumber: ${this.remoteNumber}`);
                //console.log(`rN: ${rN}`);
            }
        },
        groupUUID: function(gUUID) {
            this.messages =[];
            if(this.groupUUID){
                const observedGroupUUIDChangeQueryParams= <MessageQuery>({ extension_uuid: this.$route.query.extension_uuid,
                group: gUUID });
                //console.log(observedChangeQueryParams)
                this.messages = this.state.conversations[gUUID];
                this.title= gUUID;
            }
            this.conversationKey=gUUID;
        }
    },
    methods: {
        //this needs to include logic for returning {key:threadID, messages:Array<MessageData>}
        async fetchInitialMessages() {
            //console.log("initial fetching")
            this.messages=new Array<MessageData>();
            // replace `getPost` with your data fetching util / API wrapper
            if(this.$route.query.number){
                let params = <MessageQuery>({ extension_uuid: this.$route.query.extension_uuid,
                number: this.$route.query.number });
                //console.log(`fetchInitalMessages params: ${params}`)
                return await getMessages(params);
            }
            else {
                let params = <MessageQuery>({ extension_uuid: this.$route.query.extension_uuid,
                group: this.$route.query.group });
                return await getMessages(params);
            }            
        },

        scrollToBottom() {
            //console.log('scrolling conversation to bottom');
            const messageContainer = this.$refs.message_container;
            messageContainer.scrollTo(0, messageContainer.scrollHeight);
        },
        onObserve(entries: IntersectionObserverEntry[]) {
            entries.forEach((e) => {
                switch (e.target) {
                    case this.$refs.bottom:
                        this.bottomVisible = e.isIntersecting;
                        if (e.isIntersecting) {
                            this.atBottom = true;
                            //console.log(this.atBottom ? "enabling" : "disabling", "scrolling to bottom for new messages");
                        }
                        //console.log("bottom is", e.isIntersecting ? "visible" : "hidden");
                        break;
                    case this.$refs.top:
                        this.topVisible = e.isIntersecting;
                        if (e.isIntersecting && this.backfillAvailable) {
                            console.log("isIntersecting and backfillavailable");
                            emitter.emit('backfill-requested',this.conversationKey);
                        }
                        //console.log("top is", e.isIntersecting ? "visible" : "hidden");
                        break;
                    default:
                        //console.log("observed event on unknown target:", e);
                }
            })
        },
        onScroll() {
            if(this.atBottom != this.bottomVisible) {
                this.atBottom = this.bottomVisible;
                //console.log(this.atBottom ? "enabling" : "disabling", "scrolling to bottom for new messages");
            }
        },
        toBottom() {
            //console.log("new message added to bottom. scrolling?", this.atBottom);
            if (this.atBottom) {
                const messageContainer = this.$refs.message_container;
                messageContainer.scrollTo(0, messageContainer.scrollHeight);
            }
        },
    },
}

</script>

<template>
    


<div class="thread-container">
    <div class="thread-header">
        {{ title }}
        <a v-if="contactEditLink" :href="contactEditLink" class="white">
            <span class='fas fa-edit fa-fw'> </span>
        </a>
        <a v-if="groupUUID" href="javascript: void(0);" class="white" onclick="modal_open('modal-rename-group');">
            <span class='fas fa-edit fa-fw'> </span>
        </a>
    </div>
    <div class="thread">
        <div class="message-container" ref="message_container" v-on:scroll="onScroll">
            <div ref="top" :backfillAvailable="backfillAvailable" />
            <div ref="top">
                <div class="backfill" v-if="backfillAvailable">loading older messages</div>
            </div>
            <Message :message="message" :key="message.id" :lastSender="index-1>=0 ? this.state.conversations[conversationKey][index-1].from : '-1'" v-for="(message, index) in this.state.conversations[conversationKey]"/>
            <div class="message-wrapper" ref="bottom">&nbsp;</div>
        </div>
        <SendBox :remoteNumber="remoteNumber" :groupUUID="groupUUID" :ownNumber="ownNumber" />
        <div class="statusbox">{{ state.connectivityStatus }} - Sending as {{ ownNumber }}</div>
    </div>
</div>
</template>

<style>

#conversation{
    grid-column-start: 2;
    grid-column-end: 2;
}

/* these are for conversation which we are sidestepping for now */


.thread {
    height:80vh;
    margin: 0 auto;
    border-left: solid #3178b1 2px;
    border-right: solid #3178b1 2px;
    border-bottom: solid #3178b1 2px;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    padding-left: 0.5em;
    padding-right: 0.5em;

    /* stupid hack to get the text entry box to display inside the bounds of the thread */
    display: flex;
    flex-direction: column;
}

.thread-header {
    margin: 0 auto;
    padding: 1em;
    background-color: #3178b1;
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
}

.message-container {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    margin-bottom: 0.5em;
}

.backfill {
    max-width: 50em;
    margin: 0 auto;
    padding: 1em;
}

.white {
    color: white;
}

td:active{
    background-color:#3178B1;
    color:white;
}
td:hover{
    background-color: aliceblue;
}
table {
    width: 100%;
    table-layout: fixed;
}
    
.timestamp {
    color: #999;
    font-size: 8pt;
    padding-left: 0.5em;
}
.thread-name {
    font-size: 12pt;
    color: #000;
}
.thread-name:active{
    color:white;
}
.thread-last-message {
    color: #000;
}
.thread-last-message:active {
    color: #fff;
}
td {
    border: solid #3178b1;
    border-radius: 1em;
    padding: 0.25em;
    margin-bottom: 0.5em;
    min-height: calc(50px + 1em);
}
table {
    width: 100%;
    table-layout: fixed;
}
@media screen and (width <=700px){
    #conversation{ 
        display: none;
    }

}
</style>