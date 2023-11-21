<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import { MessageData } from '../../lib/global'
import { RouterLink } from 'vue-router';

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
        type: Date,
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

const updateActiveComponent = (event) => {
            // var ele = document.querySelector('.active');
            // ele.classList.remove('active');
            // var threadie = document.getElementById("THREAD");
            // console.log(ele);
            // console.log(`thread : ${threadie}`);
            // threadie.classList.add('active');
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
            type: Date,
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
            if (this.remoteNumber == this.activeThread) {
                return this.remoteNumber;
            }
            else if (this.groupUUID == this.activeThread) {
                return this.groupUUID;
            }
            return false;
        }
    },
    emits: {
        'thread-change': String,
    },
    methods: {
        routerLinkClickHandler(event) {
            if (this.remoteNumber) {
                this.$emit("thread-change", this.remoteNumber)
                console.log("Hey! you clicked me!")
                updateActiveComponent(event)
                
            }
            else if (this.groupUUID) {
                this.$emit("thread-change", this.groupUUID)
                console.log("Hey! you clicked me!")
                updateActiveComponent(event)


            }
        },
    },
    afterUpdate() {
        console.log(this.props)
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

/*
.timestamp.activeThread:hover {
    color:gray;
}
.thread-name.activeThread:hover{
    color:gray;
}

.thread-last-message.activeThread:hover {
    color: gray;
}*/

.tr_replace:hover {
    background-color: #aaaaaa;
}


.thread-preview-container {
    border-radius: 1em;
    padding: 0.5625em;
    /* margin-bottom: 0.5em;
    min-height: calc(50px + 1em); */
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

.dot {
    grid-column: 1;
    grid-row-start: 1;
    grid-row-end: 3;
    height: 50px;
    width: 50px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
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
    background-color: #5f9fd3;
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