<script lang="ts">
import { MessageData, emitter } from '../../lib/global';
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
        lastSender: {
            type: String,
            required: false,
        },
        displayName:{
            type: String,
            required: false            
        },
        mode:{
            type: String,
            required: true
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
        //console.log(this.message); 
        this.bumpTimestamp();
        this.interval = setInterval(this.bumpTimestamp, 10000);
        if (this.message.cpim) {
            if (this.message.cpim.bodyText) {
                this.text = this.message.cpim.bodyText;
                return;
            }
            //console.log(this.message.cpim.fileContentType);
            switch (this.message.cpim.fileContentType) {
                case "text/plain":
                    this.text = await this.message.cpim.getTextBody()
                    this.message.cpim.bodyText = this.text;
                    break
                case "image/png":
                this.embedImage = this.message.cpim.previewURL || this.message.cpim.fileURL;
                case "image/jpeg":
                    this.embedImage = this.message.cpim.previewURL || this.message.cpim.fileURL;
                    break;
                case "image/gif":
                    this.embedImage = this.message.cpim.previewURL || this.message.cpim.fileURL;
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
        else if (this.message.message){
            this.text = this.message.message;
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
        <div class="author" :class="this.message.direction">{{ this.lastSender == this.message.from ? "" :
            this.message.from }}</div>
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
<style>
/*MESSAGE STYLE*/
.message-wrapper {
    margin-top: 0.5em;
}

.message {
    border: solid #aaa 1px;
    border-radius: 1em;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    width: fit-content;
    max-width: 75%;
}

.message.incoming {
    float: left;
    border-radius: 1em 1em 1em 0;
    background-color: #BB6025;
    color: #fff;
}

.message.outgoing{
    float:right;
    background-color: #3178B1;    
    border-radius: 1em 1em 0 1em;
    color: #fff;
    margin-right:0.5rem;
}

.author.incoming {
    margin-left: 0.75rem;
    text-align: left;
}
.author.outgoing{
    margin-right: 1.25rem;
    text-align:right;
}

.ts {
    font-size: 7pt;
}

.message-body {
    margin: 0;
}

.message-body-inline-media {
    margin-top: 0.5rem;
    max-width: 100%;
    border-radius: 0.5em;
    max-height: 300px;
    background-color:white; /* This is for png transparency so the blue / orange message bubble doesn't ruin anything*/
}

/* MESSAGE STYLES */

</style>