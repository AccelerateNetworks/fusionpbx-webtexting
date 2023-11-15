<script lang="ts" >
import ThreadPreview, { ThreadPreviewInterface } from '../ThreadPreview/ThreadPreview.vue';

// type ThreadListInterface = {
    
//     username: String,
// }


export default{
    name:'ThreadList',
//     data(){
//         const threads:Array<ThreadPreviewInterface> = [
//             {
//                 displayName: "dan ryan",
//     bodyPreview: "Hmm",
    
//     link: "thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310",
    
//     timestamp: new Date("2023-09-06 21:57:12.733721"),
    
//     remoteNumber: "12068589310",
    
//     ownNumber: "12065797799"
//     }
    
// }

//         ]

//     },
    
    props:{
        displayName: String,
        ownNumber: String,
        threads: Array<Object>,
            threadPreviews: Array<ThreadPreviewInterface>
    },
    components:{ThreadPreview},
    data(){
        return {activeThread: false}
    },
    methods:{
        recieveEmit(activeConversation){
            // alert(`active conversation: ${activeConversation}`);
            this.activeThread = activeConversation;
        }
    }
}


    /*
        get the user extension this is handled in threadlist.php
    */

    /* add contact type stuff
    <form method='get' action="thread.php" onsubmit="clean_number()">
    <input type="hidden" name="extension_uuid" value="<?php echo $extension['extension_uuid']; ?>" />
    <div id='modal-new-thread' class='modal-window'>
        <div>
            <span title="" class='modal-close' onclick="modal_close(); ">&times</span>
            <span class='modal-title'>New Message</span>
            <span class='modal-message'>Enter Number: <input type="text" name="number" id="new-thread-number" placeholder="(206) 555-1212" /></span>
            <span class='modal-actions'>
                <button type='button' alt='Cancel' title='Cancel' onclick='modal_close();' class='btn btn-default' ><span class='fas fa-times fa-fw'></span><span class='button-label never pad'>Cancel</span></button>
                <button type='submit' name='action' value='Ok' id='btn_ok' alt='ok' title='ok' onclick='modal_close();' class='btn btn-default' style='float: right; margin-left: 15px' ><span class='fas fa-check fa-fw'></span><span class='button-label never pad'>Start</span></button>
            </span>
        </div>
    </div>
    <input type='hidden' name='key_uuid' id='key_uuid'/>
    </form>
    */
</script>
<template>
    <div class="threadlist_container">
        <div class='table'>
            <div class="preview_list_container">
                <ThreadPreview @thread-change="recieveEmit" v-for="preview in threadPreviews"   :key="preview.toString()" v-bind="preview" :activeThread="this.activeThread"/>
            </div>
        </div>
    </div>
</template>
<style>
.preview_list_container{
    direction:ltr;
    padding-left:0.25rem;
}


.threadlist_container{
    height: 80vh;
    grid-column-start: 1;
    grid-column-end: 1;
    padding-right: 0.25rem;
}




.table {
    /*border-spacing: 1em; */
    direction:rtl;
    overflow-y: scroll;
    height: 80vh;
    width: 100%;
    table-layout: fixed;
}

@media screen  and (width <=700) {
    div.action_bar{
        top: 0px;
    }
    .table{
        height:80vh;
    }
}

</style>