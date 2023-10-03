<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue'
import { useRoute } from 'vue-router';
import { MessageData } from '../../lib/global';

export default {
    //     data() {    },
    //     props:{
    //         activeConvo:{
    //             type:String,
    //         },
    //         remoteNumber: {
    //             type: String,
    //         },
    //         groupUUID: {
    //             type: String,
    //         },
    //         displayName: {
    //             type: String,
    //         },
    //         ownNumber: {
    //             type: String,
    //             required: true,
    //         },
    //         contactEditLink: {
    //             type: String,
    //         },
    //         groupMembers: {
    //             type: Array<String>,
    //         }
    //     },
    components: { Conversation, ThreadList },
}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <Router-View>

    <div id="WEB_TEXT_ROOT">
        <link type="text/css" href="../../../js/style.css">
        <ThreadList username='Steve'/>
        <!-- <div class="threadlist_container"> 
                    <div class='action_bar' id='action_bar'>
                        <div class='heading'><b>WebTexting</b>  this.props.username  </div>
                        <div class='actions'>
                        </div>
                        <div style='clear: both;'></div>
                    </div>
                    <table class='table'> -->
        <!-- <ThreadPreview  v-for="preview in this.threads" /> -->
        <!-- <tbody><tr><td><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161"><span class="thread-name">12063801161</span><br><span class="thread-last-message">Test </span><span class="timestamp" data-timestamp="2023-09-13 21:39:05.45867">9 days ago</span></a></td></tr>
                            <tr><td><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">dan ryan</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></td></tr>
                            </tbody>
                    </table> -->
        <!-- </div> -->
        <div id="conversation" data-v-app="">
            <div class="thread-header">12063801161 <!----> as {{this.$route.query.number ? this.$route.query.number : this.$route.query.extension_uuid}}<!----></div>
            <div class="thread">
                <div class="message-container">
                    <backfill backfillavailable="false"></backfill>
                    <div><!----></div>
                    <div class="message-wrapper">
                        <div class="author incoming">12063801161</div>
                        <div class="message incoming">
                            <p class="message-body">Test message </p><!----><!---->
                            <span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Scroll bar test requires more messages sorry for the spam</p>
                            <!----><!---->
                            <span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!---->
                            <span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!---->
                            <span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Spam</p><!----><!----><span class="ts">14 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Again thanks for understanding </p><!----><!----><span class="ts">14
                                days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Testing </p><!----><!----><span class="ts">9 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">
                        <div class="author incoming"></div>
                        <div class="message incoming">
                            <p class="message-body">Test </p><!----><!----><span class="ts">9 days ago</span>
                        </div>
                    </div>
                    <div class="message-wrapper">&nbsp;</div>
                </div>
                <div class="attachment-previews"></div>
                <div class="sendbox"><textarea maxlength="160" class="textentry" autofocus="true"></textarea><label
                        for="attachment-upload" class="btn btn-attach"><span
                            class="fas fa-paperclip fa-fw"></span></label><input type="file" id="attachment-upload"
                        multiple="true" style="display: none;"><button class="btn btn-send" disabled="false"><span
                            class="fas fa-paper-plane fa-fw"></span></button></div>
                <div class="char-counter-box">
                    <div class="char-counter-display">0 / 160</div>
                </div>
                <div class="statusbox">Registered - Sending as 12068589311</div>
            </div>
        </div>
    </div>
    </Router-View>
</template>

<style scoped>
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


/*MESSAGE STYLE*/
.message-wrapper {
    margin-top: 0.5em;
}

.message {
    border: solid #aaa 1px;
    border-radius: 1em;
    padding-left: 0.75em;
    padding-right: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    width: fit-content;
    max-width: 75%;
}

.message.incoming {
    float: right;
    border-radius: 1em 1em 0 1em;
    background-color: #3178B1;
    color: #fff;
}

.message.outgoing {
    border-radius: 1em 1em 1em 0;
    background-color: #BB6025;
    color: #fff;
}

.author.incoming {
    text-align: right;
}

.ts {
    font-size: 7pt;
}

.message-body {
    margin: 0;
}

.message-body-inline-media {
    max-width: 100%;
    border-radius: 0.5em;
}

/* MESSAGE STYLES */</style>