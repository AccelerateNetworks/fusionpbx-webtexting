<script lang="ts">
import { MessageData } from '../lib/state';
import type { PropType } from 'vue'

export default {
    props: {
        message: {
            type: Object as PropType<MessageData>,
            required: true,
        },
    },
}
</script>

<template>
    <div class="message-wrapper">
        <div class="message message-{{ message.direction }}">
            <p class="message-body">{{ message.body }}</p>
            <span class="timestamp">{{ message.timestamp.fromNow() }}</span>
        </div>
    </div>
</template>
