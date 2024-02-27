<script lang="ts">

import { MessageData, emitter, state } from '../../lib/global';
import { CPIM } from '../../lib/CPIM'
import Message from '../message/Message.vue';
import moment from 'moment';
import SendBox from '../SendBox/SendBox.vue';
let fetchingActive = false;
interface TestURLParams {
    extension_uuid: String,
    number?: String
}
interface ConversationProps {
    extension_uuid: String,
    number?: String,
    group?: String
}
type MessageBundle = {
    messages: MessageData[]
}
type MessageQuery = {
    extension_uuid: string,
    number?: string,
    group?: string,
    older_than?: string,
}

const getMessages = async (queryParams: MessageQuery) => {
    if (fetchingActive) {
        //console.log("skipping duplicate message fetches");
        return;
    }
    fetchingActive = true;
    try {
        let params: MessageQuery = {
            extension_uuid: queryParams.extension_uuid
        }
        if (queryParams.number) {
            params.number = queryParams.number
        }
        if (queryParams.group) {
            params.group = queryParams.group
        }
        let key = '';
        //console.log(params);
        let r = await fetch('/app/webtexting/messages.php?' + new URLSearchParams(params).toString());
        let response: MessageBundle = await r.json();

        //console.log(`getMessages message response ${response.messages}`)
        response.messages = response.messages.reverse();
        for (let i = 0; i < response.messages.length; i++) {
            let m = response.messages[i];
            m.timestamp = moment.utc(m.start_stamp);
            //console.log(m);
            switch (m.content_type) {
                case "message/cpim":
                    m.cpim = CPIM.fromString(m.message)
            }
            if (m.group_uuid) {
                key = m.group_uuid;
            }
            else {
                //outgoing for 2P conversation
                if (m.to_number == queryParams.number) {
                    key = m.to_number
                }
                else {
                    key = m.from_number
                }
            }

        }

        fetchingActive = false;
        return response.messages;
    }
    catch (e) {
        fetchingActive = false;
        //console.log("error retrieving messages", e)
    }

}
export default {
    name: 'convo',
    props: {
        extension_uuid: {
            type: String,
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
        },
        selectedConvo: {
            type:Boolean,
        },
    },
    components: { Message, SendBox },
    
    data() {

         let title = "";
        if (this.displayName) {
            title = this.displayName;
        } else if (this.groupMembers) {
            title = this.groupMembers.join(", ");
        }

        else if (this.remoteNumber) {
            if (title.length > 0) {
                title += " (" + this.remoteNumber + ")";
            } else {
                title += this.remoteNumber;
            }
        }
        else if(this.groupUUID){
            title+= this.groupUUID;
        }
        let conversationKey = this.remoteNumber ? this.remoteNumber : this.groupUUID;
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
        if (this.$route.query.number) {
            this.conversationKey = this.$route.query.number;
            //emitter.emit('backfill-requested', this.conversationKey);
        }
        else if (this.$route.query.group) {
            this.conversationKey = this.$route.query.group
            //emitter.emit('backfill-requested', this.conversationKey);
            const groupTag = document.getElementsByName("group");
                groupTag[0].value = this.$route.query.group;
        
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
                console.log('conversation fully backfilled, refusing to attempt to backfill more');
                return;
            }

            else if (this.topVisible && this.bottomVisible) {
                console.log('top and bottom of conversation visible, attempting to backfill immediately');
                emitter.emit('backfill-requested', this.conversationKey);
                return;
            }

            //console.log('will backfill if top is still visible in 1 second');
            setTimeout(() => {
                if (this.topVisible) {
                    console.log("top still visible backfill")
                    emitter.emit('backfill-requested', this.conversationKey);
                }
            }, 5000);
        });

        emitter.on('conversation-fully-backfilled', () => {
            console.log('preventing future backfilling attempts, this conversation has been fully backfilled');
            this.backfillAvailable = false;
        })

        emitter.on('thread-changed', (newDisplayName:String) => {
            console.log(`thread changed new display name is ${newDisplayName}`);
            this.title = newDisplayName;
        })
        //console.log(this.state.messages);
        //console.log("Conversation.vue mounted with props:\nremoteNumber:", this.remoteNumber, "\ngroupUUID:", this.groupUUID, "\ndisplayName:", this.displayName, "\nownNumber:", this.ownNumber);
    },
    beforeUpdate() {
        //console.log("changing active component");
        if(this.$route.query.group){
            const groupTag = document.getElementsByName("group");
                groupTag[0].value = this.$route.query.group;
        }        
    },
    watch: {
        remoteNumber: async function (rN) {
            this.messages = [];
            this.backfillAvailable = true;
            //console.log("remote number changed changing this.messages")
            if (this.remoteNumber) {

                if (this.state.conversations[rN]) {
                    //conversation found
                    //console.log("conversation found skipping fetch")
                    this.messages = this.state.conversations[rN];
                }
                else {
                    this.messages = this.state.conversations[rN];
                }
                this.conversationKey = rN;
                emitter.emit("backfill-requested", rN)
                //console.log("changed Rn " + rN);

            }
        },
        groupUUID: function (gUUID) {
            this.messages = [];
            if (this.$route.query.group) {
                //console.log(observedChangeQueryParams)
                this.messages = this.state.conversations[this.$route.query.group];
                //this.title = this.$route.query.group;
                
            }
            this.conversationKey = this.$route.query.group;
            this.backfillAvailable = true;
            emitter.emit("backfill-requested", this.$route.query.group)
        },
    },
    methods: {
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
                            emitter.emit('backfill-requested', this.conversationKey);
                        }
                        //console.log("top is", e.isIntersecting ? "visible" : "hidden");
                        break;
                    default:
                    //console.log("observed event on unknown target:", e);
                }
            })
        },
        onScroll() {
            if (this.atBottom != this.bottomVisible) {
                this.atBottom = this.bottomVisible;
                //console.log(this.atBottom ? "enabling" : "disabling", "scrolling to bottom for new messages");
            }
        },
        toBottom() {
            //console.log("new message added to bottom. scrolling?", this.atBottom);
            if (this.atBottom) {
                const messageContainer = this.$refs.message_container;
                if(messageContainer){
                    messageContainer.scrollTo(0, messageContainer.scrollHeight);
                }
            }
        },
    },
}

</script>

<template>
    <div class="thread-container" v-bind:class="selectedConvo ? 'show-convo': 'hide'" id="THREAD">
        <div class="thread-header">
            <router-link class="back-link" :to="`/threadlist.php?extension_uuid=${this.$route.query.extension_uuid}`" aria="Go Back to threadlist!">←</router-link>
            {{ title }}
            <a v-if="contactEditLink" :href="contactEditLink" class="white" target="_blank">
                <span class='fas fa-edit fa-fw'> </span>
            </a>
            
            <a v-else-if="this.$route.query.group" href="javascript: void(0);" class="white" onclick="modal_open('modal-rename-group');">
                <span class='fas fa-edit fa-fw'> </span>
            </a>
            <a v-else href="/app/contacts/contact_edit.php" class="white" target="_blank">
                <span class='fas fa-edit fa-fw'> </span>
            </a>
        </div>
        <div class="messages">
            <div class="message-container" ref="message_container" v-on:scroll="onScroll">
                <div ref="top" :backfillAvailable="backfillAvailable" />
                <div ref="top">
                    <div class="backfill" v-if="backfillAvailable">loading older messages</div>
                </div>
                <Message :message="message" :key="message.id" :displayName="this.displayName ? this.displayName : null "
                    :lastSender="index - 1 >= 0 ? this.state.conversations[conversationKey][index - 1].from : '-1'"
                    v-for="(message, index) in this.state.conversations[conversationKey]" 
                    :mode='this.groupUUID ? "group" : "solo"' />
                <div class="message-wrapper" ref="bottom">&nbsp;</div>
            </div>
            <SendBox :remoteNumber="remoteNumber" :groupUUID="this.$route.query.group" :ownNumber="ownNumber" location="Conversation"/>
            <div class="statusbox">{{ state.connectivityStatus }} - Sending as {{ ownNumber }}</div>
        </div>       
    </div>
</template>

<style>

#conversation {
    grid-column-start: 2;
    grid-column-end: 2;
}
.hide{
    display:none;
}

.messages {
    height: 80vh;
    margin: 0 auto;

    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    padding-left: 0.5em;
    padding-right: 0.5em;

    /* stupid hack to get the text entry box to display inside the bounds of the thread */
    display: flex;
    flex-direction: column;
}

.thread-header {
    box-shadow: 0 4px 4px -2px white;
    margin: 0 auto 3px auto;
    padding: 1em;
    background-color: #5f9fd3;
    color: #fff;

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

td:active {
    background-color: #3178B1;
    color: white;
}

td:hover {
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

td {
    border: solid #3178b1;
    border-radius: 1em;
}

table {
    width: 100%;
    table-layout: fixed;
}
.thread-container{
    border: solid  #5f9fd3 2px;
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
}

@media screen and (width >700px) {
    .back-link {
        display: none;
    }
}
@media screen and (width <=700px) {
    #THREAD {
        z-index: 5;
        grid-column-start: 1;
        grid-column-end: 1;
        height:94vh;
    }
    .thread-container{
        height:90vh;
    }
    .messages{
        height:88vh;
    }

}</style>