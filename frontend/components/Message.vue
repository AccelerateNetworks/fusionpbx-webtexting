<script lang="ts">
import { MessageData } from '../lib/MessageData';
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
    <main>
        <div class="message-wrapper">
            <div class="message message-{{ message.direction }}">
                <p class="message-body">{{ message.body }}</p>
                <!-- <span class="timestamp" :data-timestamp="{ message.timestamp }"></span> -->
            </div>
        </div>
    </main>
</template>
