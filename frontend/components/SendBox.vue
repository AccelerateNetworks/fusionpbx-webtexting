<script lang="ts">
import { uploadText } from '../lib/upload';
import { CPIM } from '../lib/CPIM';
import { MessageData, emitter } from '../lib/global';
import moment from 'moment';

type PendingAttachment = {
    file: File,
    previewURL: URL,
}

export default {
    data() {
        return {
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
        ownNumber: {
            type: String,
            required: true,
        }
    },
    methods: {
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

            let message: MessageData = {
                direction: 'outgoing',
                contentType: 'text/plain',
                timestamp: moment(),
                from: this.ownNumber,
                to: this.remoteNumber || this.ownNumber, // remoteNumber is null for groups but we still need a To field, so set it to our own number and strip it out server side
            }

            if (this.pendingAttachment) {
                const cpim = new CPIM();
                cpim.fileURL = this.pendingAttachment.uploadedURL;

                if (this.groupUUID) {
                    cpim.headers["Group-UUID"] = this.groupUUID;
                }

                const m = message;
                m.body = cpim.serialize();
                emitter.emit('outbound-message', m);
            }

            if (this.enteredText.length > 0) {
                if (this.groupUUID) {
                    const url = await uploadText(this.enteredText);
                    const cpim = new CPIM(url, 'text/plain');
                    cpim.bodyText = this.enteredText;

                    if (this.groupUUID) {
                        cpim.headers["Group-UUID"] = this.groupUUID;
                    }

                    console.log('outgoing cpim', cpim);

                    message.contentType = "message/cpim";
                    message.cpim = cpim;
                    message.body = cpim.serialize();
                } else {
                    message.contentType = "text/plain";
                    message.body = this.enteredText;
                }
                console.log('emitting message', message);
                emitter.emit('outbound-message', message);
            }

            console.log("sent", this.enteredText, this.pendingAttachment ? "with" : "without", "attachment");
            this.enteredText = "";
        },
        onAttach() {

        }
    }
}
</script>

<template>
    <div class="sendbox">
        <div class="attachment-preview-wrapper" v-if="pendingAttachment != null">
            <img :src="pendingAttachment.previewURL" v-if="pendingAttachment.previewURL" />
        </div>
        <textarea class="textentry" autofocus="true" @keypress="keypress" v-model.trim="enteredText" ref="textbox"></textarea>
        <label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label>
        <input type="file" id="attachment-upload" style="display: none;" v-on:change="onAttach" />
        <button class="btn btn-send" disabled><span class="fas fa-paper-plane fa-fw"></span></button>
    </div>
</template>

<style scoped>
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
