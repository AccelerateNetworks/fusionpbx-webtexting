<script lang="ts">
export default {
    props: {
        message: {
            type: String,
            required: true,
        },
        direction: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Number,
            required: true,
        }
    },
}
</script>

<template>
    <main>
        <div class="message-wrapper">
            <div class="message message-{{ direction }}">
                <p class="message-body">{{ message }}</p>
                <span class="timestamp" :data-timestamp="{ timestamp }"></span>
            </div>
        </div>
    </main>
</template>
