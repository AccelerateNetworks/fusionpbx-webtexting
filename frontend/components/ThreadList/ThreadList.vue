<script lang="ts">
import { MessageData, emitter, state, } from '../../lib/global';
import ThreadPreview from '../ThreadPreview/ThreadPreview.vue';

// type ThreadListInterface = {
    
//     username: String,
// }
export default {
    props: {
        username: String,
    },

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
}
</script>

<style>

.td_preview:active{
    background-color:#3178B1;
    color:white;
}
.td_preview:hover{
    background-color: aliceblue;
}
.td_preview{
    border: solid black;
    border-radius: 1em;
    padding: 0.5em;
    margin-bottom: 0.5em;
    min-height: calc(50px + 1em);
}
.threadlist_container{
    height: 80vh;
    grid-column-start: 1;
    grid-column-end: 1;
}
.timestamp {
    color: #999;
    font-size: 8pt;
    padding-left: 0.5em;
}
.thread-name {
    font-size: 12pt;
    color: #000;
}
.thread-last-message {
    color: #000;
}

.table {
    /*border-spacing: 1em; */
    overflow-y: scroll;
    height: 100%;
    width: 100%;
    table-layout: fixed;
}

</style>

<template>
    
    <div class="threadlist_container">
        <!-- <link rel="stylesheet" href="./frontend/components/ThreadListStyle.css">
        <link rel="stylesheet" href="./frontend/components/conversation/ConversationStyle.css">
        <link rel="stylesheet" href="./frontend/components/message/MessageStyle.css">
        <link rel="stylesheet" href="./frontend/SendBoxStyle.css"> -->


        <div class='action_bar' id='action_bar'>
            <div class='heading'><b>WebTexting</b> this.props.username  </div>
            <div class='actions'>
            </div>
            <div style='clear: both;'></div>
        </div>
        <div class='table'>
            <!-- <ThreadPreview  v-for="preview in this.threads" /> -->
            <div class="preview_list_container">
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161"><span class="thread-name">12063801161</span><br><span class="thread-last-message">Test </span><span class="timestamp" data-timestamp="2023-09-13 21:39:05.45867">9 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">dan ryan</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Franklin</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Oogway</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Pope</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Poe</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Tai Lung</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Roshi</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Goku</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12063801161"><span class="thread-name">12063801161</span><br><span class="thread-last-message">Test </span><span class="timestamp" data-timestamp="2023-09-13 21:39:05.45867">9 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">dan ryan</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Franklin</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Oogway</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Pope</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Poe</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Tai Lung</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Roshi</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                <div class='tr_replace'><div  class=td_preview><a href="thread.php?extension_uuid=fe91be7c-ecb2-4661-9d3a-bcf27099221b&amp;number=12068589310"><span class="thread-name">Goku</span><br><span class="thread-last-message">Hmm</span><span class="timestamp" data-timestamp="2023-09-06 21:57:12.733721">16 days ago</span></a></div ></div >
                </div>
            </div>
    </div>
    
</template>