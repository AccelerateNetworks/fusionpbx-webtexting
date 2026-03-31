<script lang="ts">
import { uploadText } from "../../lib/upload";
import { CPIM } from "../../lib/CPIM";
import { MessageData, GlobalState, emitter, state } from "../../lib/global";
import TemplateDropUpItem from "../TemplateDropUp/TemplateDropUpItem.vue";
import TemplateDropUpProps from "../TemplateDropUp/TemplateDropUpItem.vue";
import moment from "moment";
import {v4 as uuidv4} from 'uuid';

type PendingAttachment = {
  file: File;
  previewURL: string;
  progress: number;
  upload: Promise<void>;
  uploadedURL: string;
};
function validNumber(value:any):Boolean {
  return !isNaN(Number(value));
}

type TemplateDropUpProps = typeof TemplateDropUpProps;

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
const MAXFILESIZE = 500000; //<---500KB in bytes
function verifyFileSize(file: File) {
  if (file.size < MAXFILESIZE) {
    return true;
  }
  return false;
}
function phoneNumbertoPhoneString(number: Number) {
  return number.toString().replace(/[^\d+]/g, "");
}

export default {
  data(): {
    enteredText: string;
    pendingAttachments: PendingAttachment[];
    state: GlobalState;
    templates: Array<Object>;
  } {
    return {
      enteredText: "",
      pendingAttachments: [],
      state: state,
      templates: [],
    };
  },
  name: "SendBox",
  components: { TemplateDropUpItem },
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
    },
    location: {
      type: String,
      required: true,
    },
    extensionUUID: {
      type: String,
    },
  },
  methods: {
    loadTemplates() {
      document.getElementById("myDropdown").classList.toggle("show");
      if (this.templates.length === 0) {
        emitter.emit("load-templates", {});
      }
    },
    keypress(e: KeyboardEvent) {
      if (e.key == "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (state.connected) {
          this.send();
        } else {
          //console.log("[Sendbox] Not connected, can't send message");
        }
        return false;
      }
    },
    getRandomIntInclusive(min: number, max: number):number {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled
      ); // The maximum is inclusive and the minimum is inclusive
    },
    getMessageData(): MessageData {
      return {
        direction: "outgoing",
        contentType: "text/plain",
        timestamp: moment(new Date()),
        id: uuidv4(),
        from: this.ownNumber,
        to: this.remoteNumber || this.ownNumber, // remoteNumber is null for groups but we still need a To field, so set it to our own number and strip it out server side
      };
    },
    /* 
        Hit the send button on this Sendbox component 
        => Sendboc.send (below) 
        => SIP.ts outbound-message 
        => SIP.ts RunSIPConnection 
        => ?magic? 
        => 
        */
    async send() {
      console.log("[Sendbox.send] Send button hit. Validating and sending message...");
      //we need to fail  phone numbers that are not 11 digits long
      if (this.location === "Conversation") {
        const phoneString = this.remoteNumber;
        if (
          (this.remoteNumber &&
            (phoneString.length === 11 ||
              phoneString.length === 5 ||
              phoneString.length === 6)) ||
          this.groupUUID
        ) {
          console.log(this.enteredText);
          if (
            this.enteredText.length == 0 &&
            this.pendingAttachments.length == 0
          ) {
            this.$refs.textbox.focus();
            return;
          }

          while (this.pendingAttachments.length > 0) {
            const attachment = this.pendingAttachments.shift();
            await attachment.upload;

            //console.log("[Sendbox] sending attachment:", attachment);
            const cpim = new CPIM(attachment.uploadedURL, attachment.file.type);
            if (this.groupUUID) {
              cpim.headers["Group-UUID"] = this.groupUUID;
            }
            cpim.previewURL = attachment.previewURL;

            let message = this.getMessageData();
            message.cpim = cpim;
            //console.log('emitting message', message);
            emitter.emit("outbound-message", message);
          }

          if (this.enteredText.length > 0) {
            let message = this.getMessageData();
            console.log("the message is ", message);
            if (this.groupUUID) {
              const url = await uploadText(this.enteredText);
              const cpim = new CPIM(url, "text/plain");
              cpim.bodyText = this.enteredText;
              if (this.groupUUID) {
                cpim.headers["Group-UUID"] = this.groupUUID;
              }
              //console.log("outgoing cpim", cpim);
              message.contentType = "message/cpim";
              message.cpim = cpim;
              message.body = cpim.serialize();
            } else {
              message.contentType = "text/plain";
              message.body = this.enteredText;
            }
            //console.log('emitting message', message);
            emitter.emit("outbound-message", message);

            this.enteredText = "";
          }
        } else {
          let errorString =
            "Outbound number is invalid, not enough digits or invalid groupUUID. \n";
          if (
            this.remoteNumber.toString().length != 11 &&
            this.remoteNumber.toString().length != 6 &&
            this.remoteNumber.toString().length != 5
          ) {
            errorString += `Outbound Number: ${this.remoteNumber}`;
          } else {
            errorString += `GroupUUID: ${this.groupUUID}`;
          }

          alert(errorString);
        }
      } else {
        this.sendNewMessage();
      }
    },
     
    async sendNewMessage() {
      const phoneString = this.remoteNumber;
      if (
        (validNumber(this.remoteNumber) &&
          (phoneString.length === 11 ||
            phoneString.length === 5 ||
            phoneString.length === 6)) ||
        this.groupUUID
      ) {
        //console.log(this.enteredText);
        if (
          this.enteredText.length == 0 &&
          this.pendingAttachments.length == 0
        ) {
          this.$refs.textbox.focus();
          return;
        }
        for (let attachment of this.pendingAttachments) {
          this.removeAttachment(attachment);
        }
        this.pendingAttachments = [];

        if (this.enteredText.length > 0) {
          let message = this.getMessageData();
          if (this.groupUUID) {
            const url = await uploadText(this.enteredText);
            const cpim = new CPIM(url, "text/plain");
            cpim.bodyText = this.enteredText;

            if (this.groupUUID) {
              cpim.headers["Group-UUID"] = this.groupUUID;
            }

            //console.log("[Sendbox.sendnewMessage] Outgoing CPIM", cpim);

            message.contentType = "message/cpim";
            message.cpim = cpim;
            message.body = cpim.serialize();
          } else {
            message.contentType = "text/plain";
            message.body = this.enteredText;
          }
          if (this.extensionUUID) {
            message.extensionUUID = this.extensionUUID;
          }
          console.log('emitting message', message);
          emitter.emit("outbound-message", message);
          setTimeout(
            () => console.log("[Sendbox.sendnewMessage] duplicate send prevention timeout"),500);
          this.enteredText = "";
        }
      } else {
        let errorString =
          "Outbound number is invalid, not enough digits or invalid groupUUID. \n";
        if (
          this.remoteNumber.toString().length != 11 &&
          this.remoteNumber.toString().length != 5 &&
          this.remoteNumber.toString().length != 6
        ) {
          errorString += `Outbound Number: ${this.remoteNumber}`;
        } else {
          errorString += `GroupUUID: ${this.groupUUID}`;
        }
        if(!validNumber(this.remoteNumber)){
          errorString = `Outbound Number has non-numeric characters ${this.remoteNumber}`;
        }
        alert(errorString);
      }
    },
    onAttach(e: Event) {
      //console.log(e.target.files);
      if (this.verifyValidLocation()) {
        const target = e.target as HTMLInputElement;
        //console.log(target);
        for (const file of target.files) {
          if (verifyFileSize(file)) {
            const a: PendingAttachment = {
              file: file,
              previewURL: URL.createObjectURL(file),
              progress: 0,
              upload: null,
              uploadedURL: null,
            };
            a.upload = this.uploadAttachment(a);
            this.pendingAttachments.push(a);
          } else {
            alert(
              `The selected file is too large. We cannot send files bigger than ${
                MAXFILESIZE / 1000
              }kB.`
            );
          }
        }
      } else {
        //alert('Attachments not supported for new conversations at this time.')
      }
    },
    removeAttachment(attachment: PendingAttachment) {
      let position = this.pendingAttachments.indexOf(attachment);
      //console.log("[Sendbox.removeAttachment] Removing attachment", position, attachment);
      this.pendingAttachments.splice(position, 1);
    },
    async uploadAttachment(attachment: PendingAttachment): Promise<void> {
      if (this.verifyValidLocation()) {
        const uploadTarget = await fetch("upload.php", {
          method: "POST",
          body: JSON.stringify({ filename: attachment.file.name }),
        }).then((r) => r.json());

        attachment.uploadedURL = uploadTarget.download_url;

        //console.log("[Sendbox.uploadAttachment] Uploading ", uploadTarget);
        const resp = await fetch(uploadTarget.upload_url, {
          method: "PUT",
          body: await attachment.file.arrayBuffer(),
        });

        attachment.progress = 100;

        //console.log("[Sendbox] uploaded: ", resp);
      } else {
        //alert('Attachments not supported for new conversations at this time.')
      }
    },
    verifyValidLocation() {
      if (this.location === "Conversation") {
        return true;
      } else if (this.location === "New-Message") {
        return true;
      } else {
        alert("Invalid SendBox location.");
      }
      return false;
    },
    attachPendingAttachment(file: File) {
      if (verifyFileSize(file)) {
        const a: PendingAttachment = {
          file: file,
          previewURL: URL.createObjectURL(file),
          progress: 0,
          upload: null,
          uploadedURL: null,
        };
        a.upload = this.uploadAttachment(a);
        this.pendingAttachments.push(a);
      } else {
        alert(
          `The selected file is too large. We cannot send files bigger than ${
            MAXFILESIZE / 1000
          }kB.`
        );
      }
    },
    onPaste(e: ClipboardEvent)  {
      var items = e.clipboardData.items;
      //console.log(JSON.stringify(items)); // will give you the mime types
      for (const item of items) {
        switch (item.type) {
          case "image/png":
            if (this.verifyValidLocation()) {
              const file = item.getAsFile();
              this.attachPendingAttachment(file);
              break;
            } else {
              alert(
                "Attachments not supported for new conversations at this time."
              );
              break;
            }

          case "image/jpg":
            if (this.verifyValidLocation()) {
              const file = item.getAsFile();
              this.attachPendingAttachment(file);
              break;
            } else {
              alert(
                "Attachments not supported for new conversations at this time."
              );
              break;
            }

          case "image/jpeg":
            if (this.verifyValidLocation()) {
              const file = item.getAsFile();
              this.attachPendingAttachment(file);
              break;
            } else {
              alert(
                "Attachments not supported for new conversations at this time."
              );
              break;
            }
          case "text/plain":
            continue;
          default:
            //console.log("[Sendbox.onPaste] Discarding clipboard data of unknown type:", item);
        }
      }
    },
  },
  mounted() {
    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
      if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName(
          "dropdown-content-menu"
        );
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
            openDropdown.classList.remove("show");
          }
        }
      }
    };
    emitter.on("dropup-selection-recieved", (payload: String) => {
      //console.log("[Sendbox] Selection Recieved. You selected: " + payload);
      this.enteredText = payload;
    });
    emitter.on(
      "backfill-template-complete",
      (payload: Array<TemplateDropUpProps>) => {
        if (payload.length > 0) {
          this.templates = payload;
        }
      }
    );
  },
};
</script>

<template>
  <div class="sendbox-container">
    <div class="attachment-previews">
      <div
        class="attachment-preview-wrapper"
        v-for="attachment,key in pendingAttachments"
                      :key="key"

      >
        <img
        
          :src="attachment.previewURL"
          v-if="attachment.previewURL"
          class="attachment-preview-img"
        />
        <span
          class="fas fa-trash fa-fw remove-attachment-btn"
          v-on:click="removeAttachment(attachment)"
        ></span>
        <span class="attachment-upload-progress"
          >{{ attachment.progress }}%</span
        >
      </div>
    </div>
    <div class="sendbox">
      <textarea
        maxlength="1600"
        rows="5"
        class="textentry text-break"
        autofocus="true"
        @keypress="keypress"
        v-model.trim="enteredText"
        ref="textbox"
        v-on:paste="onPaste"
        name="text-message-entry-box"
      ></textarea>
      <div class="btn-group align-middle dropup p-2">
        <label
          v-if="location === 'Conversation'"
          for="attachment-upload"
          class="btn btn-attach"
        >
          <span
            v-if="location === 'Conversation'"
            class="fas fa-paperclip fa-fw"
          ></span>
        </label>
        <input
          v-if="location === 'Conversation'"
          type="file"
          id="attachment-upload"
          style="display: none"
          v-on:change="onAttach"
          multiple
        />
        <button
          class="btn btn-send"
          :disabled="
            (pendingAttachments.length == 0 && enteredText.length == 0) ||
            state.connected
          "
          v-on:click="send"
        >
          <span class="fas fa-paper-plane fa-fw"></span>
        </button>
        <button
          class="btn dropdown-toggle dropbtn"
          data-toggle="dropmedown"
          aria-haspopup="true"
          aria-expanded="false"
          @click="loadTemplates"
        >
          <span class="dropbtn fas fa-comment-dots" aria-hidden="true"></span>
        </button>
        <div class="dropmedown dropup">
          <div id="myDropdown" class="dropdown-content-menu">
            <TemplateDropUpItem
              v-for="message in this.templates"
              :templateName="message.template_name"
              :templateText="message.template_body"
              :key="message.template_name"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="char-counter-box">
      <div class="char-counter-display">{{ enteredText.length }} / 1600</div>
    </div>
  </div>
</template>

<style>
/*SENDBOX STYLES */

.sendbox {
  display: flex;
  margin-bottom: 0.5em;
  background-color: #eee;
}

.char-counter-box {
  display: grid;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
}

.char-counter-display {
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
  font-size: 1rem;
  padding: 0.5rem;
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
  background-color: #aaa;
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

/* DROPDOWN MENU */

.dropbtn {
  /*
    background-color: #3498DB;
    color: white;
    */
  border: none;
  cursor: pointer;
}
/*
.dropmedown {
  /*position: relative; 
    display: inline-block;
} 
*/
.dropdown-content-menu {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  bottom: 4rem;
  left: -160px;
}

.dropdown-content-menu a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropmedown a:hover {
  background-color: #ddd;
}

.show {
  display: block;
}
</style>