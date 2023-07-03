<script lang="ts">
import { MessageData } from '../lib/state';
import type { PropType } from 'vue'

export default {
    data() {
        return {
            text: null,
            embedImage: null,
            embedVideo: null,
            download: null,
        }
    },
    props: {
        message: {
            type: Object as PropType<MessageData>,
            required: true,
        },
    },
    async mounted() {
        if(this.message.body) {
            this.text = this.message.body;
            return;
        }

        if(this.message.cpim) {
            switch(this.message.cpim.fileContentType) {
                case "text/plain":
                    this.text = await this.message.cpim.getTextBody()
                    break
                case "image/png":
                case "image/jpg":
                case "image/jpeg":
                    this.embedImage = this.message.cpim.fileURL;
                    break;
                default:
                    this.download = this.message.cpim.fileURL;
                    const u = new URL(this.message.cpim.fileURL);
                    const pathParts = u.pathname.split('/');
                    break;
            }

        }
    }
}
</script>

<template>
    <div class="message-wrapper">
        <div class="author" :class="this.message.direction">{{  this.message.from }}</div>
        <div class="message" :class="this.message.direction">
            <p class="message-body" v-if="this.text">{{ this.text }}</p>
            <p class="message-body" v-if="this.embedImage">
                <a :href="embedImage" target="_blank">
                    <img class="message-body-inline-media" :src="embedImage" />
                </a>
            </p>
            <p class="message-body" v-if="this.download">
                <a :href="download" target="_blank">click to download</a>
            </p>
            <span class="timestamp">{{ message.timestamp.fromNow() }}</span>
        </div>
    </div>
</template>

<style scoped>
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
}

.author.incoming {
    text-align: right;
}

.timestamp {
    font-size: 7pt;
}

.message-body {
    margin: 0;
}

.message-body-inline-media {
    max-width: 100%;
    border-radius: 0.5em;
}
</style>
