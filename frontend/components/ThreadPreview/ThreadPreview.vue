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
            type: String || Boolean,
            required: true,
        }
    },
    components: { Conversation },
    computed: {
        currentThread() {
            if (this.remoteNumber && this.remoteNumber == this.activeThread) {
                return this.remoteNumber;
            }
            else if (this.groupUUID && this.groupUUID == this.activeThread) {
                return this.groupUUID;
            }
            else if(this.displayName && this.displayName == this.activeThread){
                return this.displayName;
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
                //emitter.emit("thread-change", this.displayName);
                payload.key=this.displayName;
                //console.log(`Hey! you clicked me! I have displayName: ${this.displayName}`)
            }
            else if (this.remoteNumber) {
                //emitter.emit("thread-change", this.remoteNumber)
                payload.key=this.remoteNumber;
                //console.log(`Hey! you clicked me! I have remoteNumber: ${this.remoteNumber}`)
                
            }
            else{
                //emitter.emit("thread-change", this.groupUUID)
                //console.log(`Hey! you clicked me! I have groupUUID: ${this.groupUUID}`)
                payload.key=this.groupUUID;

            }
            console.log(`here's the link to edit a contact ${this.contactEditLink}`)
            payload.editLink = this.contactEditLink;
            console.log(payload);
            emitter.emit("thread-change",payload)
        },
    },
}
</script>

<template>
    <div class='tr_replace' v-bind:class="currentThread ? 'activeThread' : 'inactiveThread'">
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
    grid-column: 2;
    justify-self: start;
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

.tr_replace:hover {
    background-color: #aaaaaa;
}


.thread-preview-container {
    border-radius: 1em;
    padding: 0.5625em;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 0 auto auto;
}

.tr_replace:hover span {
    color: black;
}

.tr_replace.activeThread:hover span {
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

.tr_replace.activeThread:hover {
    background-color: #aaaaaa;
}

.tr_replace.activeThread {
    background-color: #3178B1;
}

.tr_replace.activeThread:hover {
    background-color: #aaaaaa;
}

.tr_replace:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.tr_replace:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}
</style>