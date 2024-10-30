
<script lang="ts">
import {emitter} from '../../lib/global';
type TemplateDropUpProps ={
    templateName:String,
    templateText:String
}

export default {
    name: 'TemplateDropUpItem',
    props: {
        templateName:String,
        templateText:String
    },
    components: {  },
    data() {
        return{            
        }
    },
    computed: {    },
    emits: {   'dropup-selection-recieved':String },
    methods: { 
        myMethod(){
            emitter.emit('dropup-selection-recieved', this.templateText)
        },   
    },
    mounted(){
        
    }
}
</script>
<template>
    <a class="dropdown-content-item" href="#" :onClick="myMethod">{{this.templateName}}</a>
</template>
