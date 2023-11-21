<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue'
import ConvoPlaceholder from '../ConvoPlaceholder.vue';
import { RouterView } from 'vue-router';
import { MessageData } from '../../lib/global';



export default {
    //     data() {    },
    //     props:{
    //         activeConvo:{
    //             type:String,
    //         },
    //         remoteNumber: {
    //             type: String,
    //         },
    //         groupUUID: {
    //             type: String,
    //         },
    //         displayName: {
    //             type: String,
    //         },
    //         ownNumber: {
    //             type: String,
    //             required: true,
    //         },
    //         contactEditLink: {
    //             type: String,
    //         },
    //         groupMembers: {
    //             type: Array<String>,
    //         }
    //     },
    name:'WebTextingContainer',
    props:{
        ownNumber: String,
        username:String,
        threads: Array<Object>,
        threadPreviews:Array<Object>
    },
    components: { Conversation, ThreadList },
    beforeUpdate() {
        console.log(this.props.threadPreviews);
    },
    methods:{
        calculateDisplayName(){
            if(this.$route.query.group){
                for(let m in this.$props.threadPreviews){
                    console.log(`group: ${m}`);
                }
            }
            else{
                for(let m in this.$props.threadPreviews){
                    console.log(`contact: ${m}`);
                }
            }
            console.log("display name calculated");
            return "tested";
        }
    }
    
}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <RouterView>


    <div id="WEB_TEXT_ROOT">
        <link type="text/css" href="../../../js/style.css">
        <RouterView name="leftSide" :ownNumber="this.$props.ownNumber" 
                                    :threads="this.$props.threads" 
                                    :threadPreviews="this.$props.threadPreviews"/>
        
        
    <suspense>
        <RouterView name="rightSide" 
            :extension_uuid="this.$route.query.extension_uuid" 
            :remoteNumber="this.$route.query.number" 
            :groupUUID="this.$route.query.group"
            :ownNumber="this.$props.ownNumber" 
            :displayName="this.$props.threadPreviews"
            v-bind="calculateDisplayName"/> 
    </suspense>
    </div>
</RouterView>
</template>

<style scoped></style>