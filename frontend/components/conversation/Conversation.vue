<script lang="ts">
import Message from '../message/Message.vue';
import SendBox from '../SendBox/SendBox.vue';
import { MessageData, emitter, state, } from '../../lib/global';

export default {
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

        return {
            bottomVisible: true,
            topVisible: false,
            backfillAvailable: true,
            state: state,
            enteredText: "",
            pendingAttachment: null,
            atBottom: true,
            title: title,
        }
    },
    props: {
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
    components: { Message, SendBox },
    mounted() {
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

            if (this.topVisible && this.bottomVisible) {
                console.log('top and bottom of conversation visible, attempting to backfill immediately');
                emitter.emit('backfill-requested');
                return;
            }

            console.log('will backfill if top is still visible in 1 second');
            setTimeout(() => {
                if (this.topVisible) {
                    emitter.emit('backfill-requested');
                }
            }, 5000);
        });

        emitter.on('conversation-fully-backfilled', () => {
            console.log('preventing future backfilling attempts, this conversation has been fully backfilled');
            this.backfillAvailable = false;
        })
        console.log(this.state.messages);
        console.log("Conversation.vue mounted with props:\nremoteNumber:", this.remoteNumber, "\ngroupUUID:", this.groupUUID, "\ndisplayName:", this.displayName, "\nownNumber:", this.ownNumber);
    },
    methods: {
        scrollToBottom() {
            console.log('scrolling conversation to bottom');
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
                            console.log(this.atBottom ? "enabling" : "disabling", "scrolling to bottom for new messages");
                        }
                        console.log("bottom is", e.isIntersecting ? "visible" : "hidden");
                        break;
                    case this.$refs.top:
                        this.topVisible = e.isIntersecting;
                        if (e.isIntersecting && this.backfillAvailable) {
                            emitter.emit('backfill-requested');
                        }
                        console.log("top is", e.isIntersecting ? "visible" : "hidden");
                        break;
                    default:
                        console.log("observed event on unknown target:", e);
                }
            })
        },
        onScroll() {
            if(this.atBottom != this.bottomVisible) {
                this.atBottom = this.bottomVisible;
                console.log(this.atBottom ? "enabling" : "disabling", "scrolling to bottom for new messages");
            }
        },
        toBottom() {
            console.log("new message added to bottom. scrolling?", this.atBottom);
            if (this.atBottom) {
                const messageContainer = this.$refs.message_container;
                messageContainer.scrollTo(0, messageContainer.scrollHeight);
            }
        },
    }
}
</script>

<template>
   
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
            <Backfill ref="top" :backfillAvailable="backfillAvailable" />
            <div ref="top">
                <div class="backfill" v-if="backfillAvailable">loading older messages</div>
            </div>
            <Message :message="message" :key="message.id" :lastSender="index-1>=0 ? state.messages[index-1].from : '-1'" v-for="(message, index) in state.messages"/>
            <div class="message-wrapper" ref="bottom">&nbsp;</div>
        </div>
        <SendBox :remoteNumber="remoteNumber" :groupUUID="groupUUID" :ownNumber="ownNumber" />
        <div class="statusbox">{{ state.connectivityStatus }} - Sending as {{ ownNumber }}</div>
    </div>
</template>
<style>

.thread {
    height: 100%;
    margin: 0 auto;
    border-left: solid #999 2px;
    border-right: solid #999 2px;
    border-bottom: solid #999 2px;
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
    background-color: rgba(0, 0, 0, 0.90);
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
}

.message-container {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    height: 100%;
    overflow: scroll;
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
</style>

