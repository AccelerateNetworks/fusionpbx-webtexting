<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue'
import ConvoPlaceholder from '../ConvoPlaceholder.vue';
import { RouterView } from 'vue-router';
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
    name:'WebTextingContainer',
    props:{
        ownNumber: String,
        username:String,
        threads: Array<Object>,
        threadPreviews:Array<Object>
    },
    components: { Conversation, ThreadList },
    
}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <RouterView>


    <div id="WEB_TEXT_ROOT">
        <link type="text/css" href="../../../js/style.css">
        <RouterView name="leftSide" :ownNumber="this.$props.ownNumber" :threads="this.$props.threads" :threadPreviews="this.$props.threadPreviews">
        </RouterView>
        
    <suspense>
        <RouterView name="rightSide" :extension_uuid="this.$route.query.extension_uuid" :remoteNumber="this.$route.query.number" :ownNumber="this.$props.ownNumber" /> 
    </suspense>
    </div>
</RouterView>
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
    border-color: #3178b1;
    color: #fff;
}

.message.outgoing {
    border-radius: 1em 1em 1em 0;
    border-color: #bb6025;
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