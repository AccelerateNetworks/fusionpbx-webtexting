<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import { MessageData } from '../../lib/global';

type ThreadPreviewInterface = {
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
    data() {

    },
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
    <tr>
        <td>
            <a :href="this.link">
                <span class='thread-name'>{{ this.displayName }}</span><br />
                <span class='thread-last-message'>{{ this.bodyPreview }}</span>
                <span class='timestamp' :data-timestamp="this.timestamp"></span>
            </a>
        </td>
    </tr>\n
</template>