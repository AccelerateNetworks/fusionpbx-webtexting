<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue';
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
            <link type="text/css" href="../../../js/style.css">
        </div>
    </RouterView>
</template>

<style>
::-webkit-scrollbar {
    width: 10px;
    height:10px;
    padding-top:3px;
    background-color: white;
}



::-webkit-scrollbar-thumb {
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 6px rgba(255,255,255,0.5); 
    background-color: #BB6025;
}
@media screen and (width<=700px){
    #main_content{
        margin-top:48px;
        border-radius:0;
        -webkit-border-radius:0;
    }
    #TEST_DIV_FOR_TESTING_WEBTEXTING{
        height:93vh;
    }
} 
@media screen and (width<=575px){
    .navbar-toggler{
        background-color: #3178B1;
    }

}


</style>