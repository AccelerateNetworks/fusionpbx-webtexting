<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue'
import { MessageData } from '../../lib/global';

export default {
    data() {    },
    props:{
        activeConvo:{
            type:String,
        },
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
    components: { Conversation,ThreadList },
}
</script>

This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer
<template>
        <link rel="stylesheet" href="./frontend/components/WebTextingContainer.css">
        <div id="WEB_TEXT_ROOT">
            <ThreadList/>
            <Conversation v-if="True"/>
        </div>

   
</template>