<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue'
import ConvoPlaceholder from '../ConvoPlaceholder.vue';
import { RouterView } from 'vue-router';
import { emitter } from '../../lib/global';



export default {
    name: 'WebTextingContainer',
    props: {
        ownNumber: String,
        username: String,
        threads: Array<Object>,
        threadPreviews: Array<Object>
    },
    computed: {
        // a computed getter
        conversationSelected() {
            // `this` points to the component instance
            let selectedConvo = false;
            if (this.$route.query.number || this.$route.query.group) {
                selectedConvo = true;
            }
            return selectedConvo;
        },
    },
    components: { Conversation, ThreadList },
    methods: {
        calculateDisplayName() {
            if (this.$route.query.group) {
                for (let m in this.$props.threadPreviews) {
                    console.log(`group: ${m}`);
                }
            }
            else {
                for (let m in this.$props.threadPreviews) {
                    console.log(`contact: ${m}`);
                }
            }
            console.log("display name calculated");
            return "tested";
        }
    },
    mounted() {
        emitter.on('thread-change', (newDisplayName: String) => {
            emitter.emit('thread-changed', newDisplayName);
        })
    },

}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <RouterView>


        <div id="WEB_TEXT_ROOT">
            <link type="text/css" href="../../../js/style.css">
            <RouterView name="leftSide" :ownNumber="this.$props.ownNumber" :threads="this.$props.threads"
                :threadPreviews="this.$props.threadPreviews" 
                :selectedConvo="this.conversationSelected"/>


            <suspense> 
                <RouterView name="rightSide" 
                    :extension_uuid="this.$route.query.extension_uuid"
                    :remoteNumber="this.$route.query.number" 
                    :groupUUID="this.$route.query.group"
                    :ownNumber="this.$props.ownNumber" 
                    :displayName="this.$props.displayName"
                    :selectedConvo="this.conversationSelected" 
                    v-bind="calculateDisplayName" />
            </suspense>
        </div>
    </RouterView>
</template>

<style>
@media screen and (width<700px){
    #main_content{
        margin-top:48px;
        border-radius:0;
        -webkit-border-radius:0;
    }
    #TEST_DIV_FOR_TESTING_WEBTEXTING{
        height:93vh;
    }
} 


</style>