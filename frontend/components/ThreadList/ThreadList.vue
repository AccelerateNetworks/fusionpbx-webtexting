<script lang="ts">
import { MessageData, emitter, state, } from '../../lib/global';
import ThreadPreview from '../ThreadPreview/ThreadPreview.vue';

type ThreadListInterface = {
    threads: {
        type: Array<ThreadPreviewInterface>,
        required: true,
    }
}
export default {
    props: {
        threads: {
            type: Array,
            required: true,
        }

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
<template>
    <link rel="stylesheet" href="./frontend/components/ThreadList/ThreadListStyle.css">
    <div class='action_bar' id='action_bar'>
        <div class='heading'><b>WebTexting</b> {{ this.username }} </div>
        <div class='actions'>
        </div>
        <div style='clear: both;'></div>
    </div>
    <table class='table'>
        <ThreadPreview v-for="preview in this.threads" />
    </table>
</template>
