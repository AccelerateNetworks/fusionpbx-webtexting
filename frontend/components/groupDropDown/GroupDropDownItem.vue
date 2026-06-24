
<script lang="ts">
import {emitter} from '../../lib/global';

export type GroupDropDownItemProps = {
    name: String,
    group_uuid: String,
    members: String
}

export default {
    name: 'GroupDropDownItem',
    props: {
        name:String,
        group_uuid: String,
        members: String
    },
    components: {  },
    data() {
        return{            
        }
    },
    computed: {    },
    emits: {   'group-dropup-selection-recieved':String },
    methods: { 
        emitUUID() {
            event.preventDefault();
            emitter.emit('group-dropup-selection-recieved', this.group_uuid);
            console.log("group-dropup-selection-recieved event emitted from GroupDropDownItem", this.group_uuid);
        },   
    },
    mounted(){
        
    }
}
</script>
<template>
    <a class="dropdown-content-item" href="#" :onClick="emitUUID" :title="this.members">{{this.name||this.members}}</a>
</template>
