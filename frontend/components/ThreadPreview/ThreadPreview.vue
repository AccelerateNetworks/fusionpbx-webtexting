<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import { MessageData, emitter, ThreadChangePayload } from '../../lib/global'

export type ThreadPreviewInterface = {
    displayName: {
        type: String,
    },
    bodyPreview: {
        type: String,
    },
    link: {
        type: String,
    },
    timestamp: {
        type: String,
    },
    remoteNumber: {
        type: String,
    },
    groupUUID: {
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
}


export default {
    name: 'ThreadPreview',
    props: {
        displayName: {
            type: String,
        },
        bodyPreview: {
            type: String,
        },
        link: {
            type: String,
        },
        timestamp: {
            type: String,
        },
        remoteNumber: {
            type: String,
        },
        groupUUID: {
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
        activeThread: {
            type: String,
        },
        isFiltered:{
            type: Boolean,
        },
        newMessages:{
            type: Number
        }
    },
    components: { Conversation },
    data() {
        return{
            newMessages:0
        }
    },
    computed: {
        currentThread() {
            if(this.displayName && this.displayName == this.activeThread){
                return this.displayName;
            }
            else if (this.remoteNumber && this.remoteNumber == this.activeThread) {
                return this.remoteNumber;
            }
            else if (this.groupUUID && this.groupUUID == this.activeThread) {
                return this.groupUUID;
            }
            return false;
        },
    },
    emits: {
        'thread-change': String,
        'change-active-thread': String
    },
    methods: {
        routerLinkClickHandler(event) {
            
            let payload:ThreadChangePayload= {key:' ',};
            
            if(this.displayName){
                payload.key=this.displayName;
                //console.log(`Hey! you clicked me! I have displayName: ${this.displayName}`)
            }
            else if (this.remoteNumber) {
                payload.key=this.remoteNumber;
                //console.log(`Hey! you clicked me! I have remoteNumber: ${this.remoteNumber}`)
                
            }
            else{
                //console.log(`Hey! you clicked me! I have groupUUID: ${this.groupUUID}`)
                payload.key=this.groupUUID;

            }
            //console.log(`here's the link to edit a contact ${this.contactEditLink}`)
            payload.editLink = this.contactEditLink;
            //console.log(payload);
            console.log(payload.key)
            this.newMessages=0;
            emitter.emit("thread-change",payload)
        },
        newMessageHandler(){
            if(this.currentThread=='activeThread'){
                this.newMessages = 0;
            }
        }
    },
    mounted(){
        emitter.on("update-last-message",(message:MessageData) =>{
            if(message.cpim){
                // console.log(message.cpim.headers['Group-UUID'])
                // console.log(message.cpim.headers["Group-UUID"])
                // console.log(message.cpim.headers['group-uuid'])
                // console.log(message.cpim.headers["group-uuid"])


                if( message.cpim.headers["group-uuid"]){
                    if(message.direction =='incoming' && this.groupUUID == message.cpim.headers["group-uuid"] ){
                        this.newMessages++;
                    }
                }
                else{
                    console.log(this.remoteNumber, " ", message.from)

                    if(message.direction=='incoming' && this.remoteNumber == message.from){
                        this.newMessages++;
                    }
                }
            }
            else{
                if(message.direction == 'incoming' && message.from == this.remoteNumber ){
                    console.log(this.remoteNumber, " ", message.from)
                    if(this.currentThread != 'activeThread'){
                        this.newMessages++;
                        console.log(this.newMessages);
                    }
                }
            }                
        })

    }
}
</script>

<template>
    <div class='tr_replace' :data-displayName="this.displayName"  v-if='true' v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'">
        <div class='td_preview' v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'">
            <router-link :to="this.link" class="thread-link" @click="routerLinkClickHandler">
                <div class="thread-preview-container" v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'">
                    <!-- <span class="dot"></span> -->
                    <span class='thread-name' v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'">{{
                        this.displayName }}</span>
                    <span class='timestamp' v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'"
                        :data-timestamp="this.timestamp"></span>

                    <span class='thread-last-message' v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'">{{
                        this.bodyPreview }}</span>
                        <div class="new-messages">
                            <span class="new-message-alert-dot bgc-AN-orange" v-if="newMessages>0">{{this.newMessages}}</span>
                        </div>
                </div>


            </router-link>
        </div>
    </div>
</template>

<style>
.thread-name {
    grid-column-start: 2;
    grid-column-end: 2;
    grid-row: 1;
    justify-self: start;
    color: black;
}

.timestamp {
    grid-column-start: 3;
    grid-column-end: 3;
    grid-row: 1;
    justify-self: end;
}

.thread-last-message {
    color: darkgray;
    grid-row-start: 2;
    grid-column: 1;
    justify-self: start;
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.new-messages{
    grid-row:2;
    grid-column: 3;
    display: inline-block;
    justify-content: right;
    justify-self: right;
}
.new-message-alert-dot {    
         border-radius: 50%;
         -moz-border-radius: 50%;
         -webkit-border-radius: 50%;
         color: #ffffff;
         display: inline-block;
         font-weight: bold;
         line-height: 22px;
         margin-right: 1.5rem;
         text-align: center;
         width: 22px;
 
 }
 .dot:hover{
     color:#fff;
 }

.timestamp.activeThread {
    color: white;
}

.thread-name.activeThread {
    color: white;
}

.thread-last-message.activeThread {
    color: white;
}

.text-center {
    margin: 0;
    position: relative;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
}

.activeThread {
    color: white;
}

.thread-preview-container {
    border-radius: 1em;
    padding: 0.5625em;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 0 auto auto;
}
.tr_replace{
    max-height: 6rem;

}

.tr_replace:hover span {
    color: black;
}
.tr_replace:hover {
    background-color: #aaaaaa;
}

.tr_replace.activeThread:hover span {
    color: white;
}
.tr_replace.activeThread:hover {
    background-color: #aaaaaa;
}

.tr_replace.activeThread {
    background-color: #3178B1;
}

.tr_replace.activeThread:hover {
    background-color: #aaaaaa;
}

/*
.tr_replace:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
*/
.tr_replace:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}
</style>