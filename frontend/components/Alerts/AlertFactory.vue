<script lang="ts">
import { emitter } from '../../lib/global';
import Alert, { AlertData } from './Alert.vue';

export default {
  components: { Alert },
    name: 'AlertFactory',
    props:{
    },
    data() {
        let AlertList:Array<AlertData>=[];
        return {
            AlertList
        }
    },
    mounted() {
        emitter.on('delete-template-failed', (payload:AlertData)=>{
            console.log("failed to delete template make an alert about it.");
            payload.message = "failed to delete template make an alert about it.";
            payload.type='Error';
                        this.AddAlert(payload);

        })
        emitter.on('delete-template-success', (payload)=>{
            console.log("deleted template Sucessfully.");
                        this.AddAlert(payload);

        })
        emitter.on('group-rename-failed', (payload)=>{
            console.log("failed to rename group make an alert about it");
                        this.AddAlert(payload);

        })
        emitter.on('group-rename-success', (payload)=>{
            console.log("Succesfully renamed group.");
                        this.AddAlert(payload);

        })
        emitter.on('template-save-complete', (payload)=>{
            this.AddAlert(payload);
        })
    },
    methods: {
        AddAlert(arg:AlertData){
            //create a new <Alert> component
            //add it to the alert-box div
                        console.log('alert box outbound message event listener');
                        console.log(arg);
                        this.$data.AlertList.push(arg);

        }
    },
}
</script>
<template>
    <div class="alert-box">
        <Alert v-for="(alert,index) in this.$data.AlertList" :status="alert.status" :error="alert.error" :message="alert.message" :type="alert.type"/>
    </div>
</template>
<style scoped>
.alert-box{
    position:fixed !important;
    width:100%;
    justify-content: flex-end;
}
</style>