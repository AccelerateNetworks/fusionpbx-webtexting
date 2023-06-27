<script lang="ts">
import Message from './Message.vue';

export default {
    data() {
        return {
            messages: [],
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
        }
    },
}
</script>

<template>
    <main>
        <div class="thread-header">{{  displayName }}</div>
        <div class="thread">
        <div class="message-container">
            <Message v-for="message in messages" />
        </div>
        <div class="attachment-preview"></div>
        <div class="sendbox">
            <textarea class="textentry" autofocus="true"></textarea>
            <label for="attachment-upload" class="btn btn-attach"><span class="fas fa-paperclip fa-fw"></span></label>
            <input type="file" multiple id="attachment-upload" style="display: none;" />
            <button class="btn btn-send" disabled><span class="fas fa-paper-plane fa-fw"></span></button>
        </div>
        <div class="statusbox">loading</div>
        </div>
    </main>
</template>

<style>
.container-fluid {
    height: calc(100% - 108px);
}

#main_content {
    height: calc(100% - 108px);
}

.thread {
    max-width: 50em;
    height: calc(100% - 120px);
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

.white {
    color: #fff;
}

.message-container {
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    height: 100%;
    overflow: scroll;
    margin-bottom: 0.5em;
}

.message {
    margin-top: 0.5em;
    border: solid #aaa 1px;
    border-radius: 1em;
    padding-left: 0.75em;
    padding-right: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    width: fit-content
}

.message-inbound {
    float: right;
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

.timestamp {
    font-size: 7pt;
}

.message-body {
    margin: 0;
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
