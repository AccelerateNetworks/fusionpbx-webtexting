
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
    emits: {   'group-dropup-selection-recieved':String,
              'dev-menu-group-selection':String
    },
    methods: { 
        emitUUID() {
            emitter.emit('group-dropup-selection-recieved', this.group_uuid);
            console.log(this.group_uuid);
            emitter.emit('dev-menu-group-selection', this.group_uuid);
            console.log("emitted to dev test menu");
        },   
    },
    mounted(){
        
    }
}
</script>
<template>
    <div class="dropdown-content-item">
        <a class="dropdown-content-item" href="#" :onClick="emitUUID" :title="this.members">{{this.name||this.members}}</a>
    </div>
</template>
<style lang="css">
.dropdown-content-item {
    display: block;
    padding: 8px 16px;
    text-decoration: none;
    color: #333;
    cursor: pointer;
}
.dropdown-content-item:hover {
    background-color: #ddd;
}
</style>