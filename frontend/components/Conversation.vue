<script lang="ts">
import Message from './Message.vue';
import { MessageData, state } from '../lib/state';
import { uploadText } from '../lib/upload';
import { CPIM } from '../lib/CPIM';

export default {
    data() {
        return {
            state: state,
            enteredText: "",
            pendingAttachment: null,
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
            required: true,
        },
        ownNumber: {
            type: String,
            required: true,
        }
    },
    components: { Message },
    mounted() {
        this.scrollToBottom()
        this.emitter.on('scroll-to-bottom', this.scrollToBottom);
        console.log("Conversation.vue mounted with props:\nremoteNumber:", this.remoteNumber, "\ngroupUUID:", this.groupUUID, "\ndisplayName:", this.displayName, "\nownNumber:", this.ownNumber);
    },
    methods: {
        scrollToBottom() {
            console.log('scrolling conversation to bottom');
            const messageContainer = this.$refs.message_container;
            messageContainer.scrollTo(0, messageContainer.scrollHeight);
        },
        keypress(e) {
            if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.send();
                return false;
            }
        },
        async send() {
            if (this.enteredText.length == 0 && this.pendingAttachment == null) {
                this.$refs.textbox.focus();
                return;
            }

            const message: MessageData = {
                direction: 'outgoing',
                contentType: 'text/plain',
                timestamp: moment(),
                from: this.ownNumber,
                to: this.remoteNumber || this.ownNumber, // remoteNumber is null for groups but we still need a To field, so set it to our own number and strip it out server side
            }

            if (this.pendingAttachment) {
                const cpim = new CPIM();
                cpim.fileURL = attachment;

                if(this.groupUUID) {
                    cpim.headers["Group-UUID"] = this.groupUUID;
                }

                const m = message;
                m.body = cpim.serialize();
                this.emitter.emit('outbound-message', m);
            }

            if (this.enteredText.length > 0) {
                if (this.groupUUID) {
                    const cpim = new CPIM();
                    if(this.groupUUID) {
                        cpim.headers["Group-UUID"] = this.groupUUID;
                    }
                    cpim.fileURL = await uploadText(this.enteredText);

                    message.contentType = "message/cpim";
                    message.body = cpim.serialize();
                } else {
                    message.contentType = "text/plain";
                    message.body = this.enteredText;
                }
                console.log('emitting message', message);
                this.emitter.emit('outbound-message', message);
            }

            console.log("sent", this.enteredText, this.pendingAttachment ? "with" : "without", "attachment");
            this.enteredText = "";
        }
    }
}
</script>

<template>
    <div class="thread-header">{{ displayName }}</div>
    <div class="thread">
        <div class="message-container" ref="message_container">
            <Message :message="message" v-for="message in state.messages" />
        </div>
        <div class="attachment-preview"></div>
        <div class="sendbox">
            <textarea class="textentry" autofocus="true" @keypress="keypress" v-model.trim="enteredText"
                ref="textbox"></textarea>
            <label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label>
            <input type="file" id="attachment-upload" style="display: none;" />
            <button class="btn btn-send" disabled><span class="fas fa-paper-plane fa-fw"></span></button>
        </div>
        <div class="statusbox">{{ state.connectivityStatus }}</div>
    </div>
</template>

<style scoped>
.thread {
    max-width: 50em;
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
    max-width: 50em;
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

.sendbox {
    display: flex;
    margin-bottom: 0.5em;
    background-color: #eee;
}

.textentry {
    border: 0;
    background-color: inherit;
    resize: none;
    /* prevent the user from resizing the text box */
    flex-grow: 1;
}

.btn-attach {
    padding: 0;
    margin: auto 0;
}

.btn-send {
    flex-grow: 1;
    max-width: fit-content;
    margin: auto 0;
}

.textentry:focus {
    outline: none;
    /* hide the browser's extra focus outline */
}

.statusbox {
    font-size: 7pt;
    text-align: right;
}

.statusbox .error {
    color: #ff5555;
}

.attachment-preview {
    display: flex;
    justify-content: left;
    background-color: #eee;
}

.attachment-preview-wrapper {
    height: 150px;
    width: 150px;
}

.attachment-preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
</style>
