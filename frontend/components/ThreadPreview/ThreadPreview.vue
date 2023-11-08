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

export default {
    name:'ThreadPreview',
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
        }

    },
    components: { Conversation },
}
</script>

<template>
    <div class='tr_replace'>
        <div class='td_preview'>
            <router-link :to="this.link">
                <span class='thread-name'>{{ this.displayName }}</span><br />
                <span class='thread-last-message'>{{ this.bodyPreview }}</span><br/>
                <span class='timestamp' :data-timestamp="this.timestamp"></span>
            </router-link>
        </div>
    </div>
</template>

<style>

</style>