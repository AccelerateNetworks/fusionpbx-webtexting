<script lang="ts">
import { uploadText } from '../lib/upload';
import { CPIM } from '../lib/CPIM';
import { MessageData, GlobalState, emitter, state } from '../lib/global';
import moment from 'moment';

type PendingAttachment = {
    file: File,
    previewURL: string,
    progress: number,
    upload: Promise<void>,
    uploadedURL: string,
}

// createRandomToken borrowed from sip.js, which does not export it :(
// https://github.com/onsip/SIP.js/blob/main/src/core/messages/utils.ts#L85
function createRandomToken(size: number, base = 32): string {
  let token = "";
  for (let i = 0; i < size; i++) {
    const r: number = Math.floor(Math.random() * base);
    token += r.toString(base);
  }
  return token;
}

export default {
    data(): {
            enteredText: string,
            pendingAttachments: PendingAttachment[],
            state: GlobalState,
        } {
        return {
            enteredText: "",
            pendingAttachments: [],
            state: state,
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
        keypress(e: KeyboardEvent) {
            if (e.key == "Enter" && !e.shiftKey) {
                e.preventDefault();
                if(state.connected) {
                    this.send();
                } else {
                    console.log("not connected, can't send message");
                }
                return false;
            }
        },
        getMessageData(): MessageData {
            return {
                direction: 'outgoing',
                contentType: 'text/plain',
                timestamp: moment(),
                id: createRandomToken(8),
                from: this.ownNumber,
                to: this.remoteNumber || this.ownNumber, // remoteNumber is null for groups but we still need a To field, so set it to our own number and strip it out server side
            }
        },
        async send() {
            if (this.enteredText.length == 0 && this.pendingAttachments.length == 0) {
                this.$refs.textbox.focus();
                return;
            }

            while(this.pendingAttachments.length > 0) {
                const attachment = this.pendingAttachments.shift();
                await attachment.upload;

                console.log("sending attachment:", attachment);

                const cpim = new CPIM(attachment.uploadedURL, attachment.file.type);
                if (this.groupUUID) {
                    cpim.headers["Group-UUID"] = this.groupUUID;
                }
                cpim.previewURL = attachment.previewURL;

                let message = this.getMessageData();
                message.cpim = cpim;
                console.log('emitting message', message);
                emitter.emit('outbound-message', message);
            }

            if (this.enteredText.length > 0) {
                let message = this.getMessageData();
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

                this.enteredText = "";
            }
        },
        onAttach(e: Event) {
            const target = e.target as HTMLInputElement;
            for(const file of target.files) {
                const a: PendingAttachment = {
                    file: file,
                    previewURL: URL.createObjectURL(file),
                    progress: 0,
                    upload: null,
                    uploadedURL: null,
                };
                a.upload = this.uploadAttachment(a);
                this.pendingAttachments.push(a);
            }
        },
        removeAttachment(attachment: PendingAttachment) {
            let position = this.pendingAttachments.indexOf(attachment);
            console.log("removing attachment", position, attachment);
            this.pendingAttachments.splice(position, 1);
        },
        async uploadAttachment(attachment: PendingAttachment): Promise<void> {
            const uploadTarget = await fetch("upload.php", {
                method: "POST",
                body: JSON.stringify({ filename: attachment.file.name })
            }).then(r => r.json());

            attachment.uploadedURL = uploadTarget.download_url;

            console.log("uploading ", uploadTarget);
            const resp = await fetch(uploadTarget.upload_url, {
                method: "PUT",
                body: await attachment.file.arrayBuffer(),
            });

            attachment.progress = 100;

            console.log("uploaded: ", resp);
        },
        onPaste(e: ClipboardEvent) {
            var items = (e.clipboardData || e.originalEvent.clipboardData).items;
            console.log(JSON.stringify(items)); // will give you the mime types
            for (const item of items) {
                switch(item.type) {
                    case "image/png":
                    case "image/jpg":
                        const file = item.getAsFile();
                        const a: PendingAttachment = {
                            file: file,
                            previewURL: URL.createObjectURL(file),
                            progress: 0,
                            upload: null,
                            uploadedURL: null,
                        };
                        a.upload = this.uploadAttachment(a);
                        this.pendingAttachments.push(a);
                        break;
                    case "text/plain":
                        continue;
                    default:
                        console.log("discarding clipboard data of unknown type:", item)
                }
            }
        }
    }
}
</script>

<template>
    <div class="attachment-previews">
        <div class="attachment-preview-wrapper" v-for="attachment in pendingAttachments">
            <img :src="attachment.previewURL" v-if="attachment.previewURL" class="attachment-preview-img" />
            <span class="fas fa-trash fa-fw remove-attachment-btn" v-on:click="removeAttachment(attachment)"></span>
            <span class="attachment-upload-progress">{{ attachment.progress}}%</span>
        </div>
    </div>
    <div class="sendbox">
        <textarea maxlength="160" class="textentry" autofocus="true" @keypress="keypress" v-model.trim="enteredText" ref="textbox" v-on:paste="onPaste" ></textarea>
        <label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label>
        <input type="file" id="attachment-upload" style="display: none;" v-on:change="onAttach" multiple />
        <button class="btn btn-send" :disabled="(pendingAttachments.length == 0 && enteredText.length == 0) || !state.connected" v-on:click="send"><span class="fas fa-paper-plane fa-fw"></span></button>
    </div>
    <div class="char-counter-box">
        <div class="char-counter-display">{{ enteredText.length }} / 160</div>
    </div>
</template>

<style scoped>
.sendbox {
    display: flex;
    margin-bottom: 0.5em;
    background-color: #eee;
}

.char-counter-box{
    display: grid;
    align-content: center;
    align-items: center;
    justify-items: center;
    justify-content: center;
}

.char-counter-display{
    align-content: center;
    align-items: center;
    justify-items: center;
    justify-content: center;
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

.attachment-previews {
    display: flex;
    flex-direction: row;
    /* overflow-x: auto; */
}

.attachment-preview {
    display: flex;
    justify-content: left;
    background-color: #eee;
}

.attachment-preview-wrapper {
    display: inline-block;
    height: 150px;
    width: 150px;
    position: relative;
    color: #fff;
    text-shadow: black 0 0 15px;
}

.attachment-preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.remove-attachment-btn {
    position: absolute;
    top: 1em;
    right: 1em;
}

.attachment-upload-progress {
    position: absolute;
    bottom: 1em;
    right: 1em;
}
</style>
