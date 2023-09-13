<script lang="ts">
import { MessageData, emitter } from '../lib/global';
import type { PropType } from 'vue'

export default {
    data() {
        return {
            text: null,
            embedImage: null,
            embedVideo: null,
            download: null,
            timestampText: "-",
            interval: null,
            loaded: false,
        }
    },
    props: {
        message: {
            type: Object as PropType<MessageData>,
            required: true,
        },
        lastSender:{
            type: String,
            requried:false,
        }
    },
    methods: {
        bumpTimestamp() {
            this.timestampText = this.message.timestamp.fromNow();
        },
        emitLoaded() {
            emitter.emit('scroll-to-bottom');
        },
    },
    async updated() {
        if (!this.loaded) {
            emitter.emit('scroll-to-bottom');
            this.loaded = true;
        }
    },
    async mounted() {
        this.bumpTimestamp();
        this.interval = setInterval(this.bumpTimestamp, 10000);
        if (this.message.cpim) {
            if (this.message.cpim.bodyText) {
                this.text = this.message.cpim.bodyText;
                return;
            }

            switch (this.message.cpim.fileContentType) {
                case "text/plain":
                    this.text = await this.message.cpim.getTextBody()
                    this.message.cpim.bodyText = this.text;
                    break
                case "image/png":
                case "image/jpg":
                case "image/jpeg":
                    this.embedImage = this.message.cpim.previewURL || this.message.cpim.fileURL;
                    break;
                default:
                    if (this.message.cpim.fileURL) {
                        this.download = this.message.cpim.fileURL;
                        const u = new URL(this.message.cpim.fileURL);
                        const pathParts = u.pathname.split('/');
                    }
                    break;
            }
        } else if (this.message.body) {
            this.text = this.message.body;
        }
    },
    unmounted() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
</script>

<template>
    <div class="message-wrapper">
        <div class="author" :class="this.message.direction">{{ this.lastSender== this.message.from ? "" : this.message.from}}</div>
        <div class="message" :class="this.message.direction">
            <p class="message-body" v-if="this.text">{{ this.text }}</p>
            <p class="message-body" v-if="this.embedImage" ref="embed">
                <a :href="embedImage" target="_blank">
                    <img class="message-body-inline-media" :src="embedImage" v-on:load="emitLoaded" />
                </a>
            </p>
            <p class="message-body" v-if="this.download">
                <a :href="download" target="_blank">click to download</a>
            </p>
            <span class="ts">{{ timestampText }}</span>
        </div>
    </div>
</template>