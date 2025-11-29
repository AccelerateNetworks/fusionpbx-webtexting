<script lang="ts">
import { emitter } from '../../lib/global';
import Alert, { AlertData } from './Alert.vue';

export default {
  components: { Alert },
    name: 'AlertFactory',
    data() {
        let AlertList:Array<AlertData>=[];
        return {
            AlertList
        }
    },
    mounted() {
        emitter.on('delete-template-failed', (payload:AlertData)=>{
            payload.type='Error';
                        this.AddAlert(payload);
        })
        emitter.on('delete-template-success', (payload)=>{
                        this.AddAlert(payload);
        })
        emitter.on('group-rename-failed', (payload)=>{
                        this.AddAlert(payload);
        })
        emitter.on('group-rename-success', (payload)=>{
                        this.AddAlert(payload);
        })
        emitter.on('template-save-complete', (payload)=>{
            this.AddAlert(payload);
        })
        emitter.on('template-save-failed', (payload)=>{
            this.AddAlert(payload);
        })
        emitter.on('message-failed', (payload:AlertData)=>{
            this.AddAlert(payload);
            emitter.emit('update-db-message-failed', payload);

        })
        emitter.on('message-sent', (payload:AlertData)=>{
            //this.AddAlert(payload);
        })
    },
    methods: {
        AddAlert(arg:AlertData){
            this.$data.AlertList.push(arg);
        }
    },
}
</script>
<template>
    <div class="alert-box">
        <Alert v-for="(alert,index) in this.$data.AlertList" :statusCode="alert.statusCode" :error="alert.error" :ReasonPhrase="alert.ReasonPhrase" :type="alert.type" v-bind:key="index"/>
    </div>
</template>
<style scoped>
.alert-box{
    /*position:fixed !important;*/
    width:100%; 
    display: flex;
    justify-content: center;
}
</style>