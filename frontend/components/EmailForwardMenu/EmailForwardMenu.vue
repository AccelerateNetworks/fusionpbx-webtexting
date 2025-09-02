<script lang="ts">
import {emitter} from '../../lib/global';
export type ForwardingCheckResponseObject={
    email: String,
    emailVerified: Boolean
}
export default{
    name:"ForwardingPlaceholder",
    props:{
        selectedConvo: Boolean,
        ownNumber: String
    },
    data(){
        return{
            phoneNumber:this.$props.ownNumber,
            emailAddress:'',
            emailVerified:false
        }
    },
    //onLoad emitter.emit("forwarded-email-check,this.$props.ownNumber")
    methods: {
        submitEmailForwardingRegisterRequest(){
            event.preventDefault();
            const params = {
                email: this.$data.emailAddress.trim(),
                dialedNumber: this.$props.ownNumber
            }
            emitter.emit("register-email-forwarding",params);
        },
        backArrowClickHandler() {
            emitter.emit('menu-change');
        },submitEmailForwardingDeregisterRequest(){
            event.preventDefault();
            const params ={
                email:'',
                dialedNumber:this.$props.ownNumber
            }
            emitter.emit("register-email-forwarding",params);
            this.$data.emailVerified=false;
        }
    },
    mounted() {
        const checkParams={
            dialedNumber:this.$props.ownNumber
        }
        emitter.emit("forwarded-email-check",checkParams);
        emitter.on('returned-forwarding-check',(args:ForwardingCheckResponseObject) =>{
            this.$data.emailAddress =  args.email
            this.$data.emailVerified = args.emailVerified
        });
        emitter.on('email-forwarding-register-success', (args:ForwardingCheckResponseObject) =>{
            this.$data.emailAddress =  args.email
            this.$data.emailVerified = args.emailVerified
        })
    },
}
</script>
<template>
        <div id="EMAIL_FORWARD" >
            <div class="templates-container">
                <div class="thread-header new-message-header">
                    <div class="thread-header-container  d-flex justify-content-between align-middle align-items-center">
                        <div class="row align-items-center align-middle">
                            <router-link class="fa fa-arrow-left btn btn-large align-middle" :to="`/menu.php`"
                                @click="backArrowClickHandler" aria="Go Back to Settings Menu"></router-link>
    
                            <div>
                                <h6 class="mb-0">Email Forwarding</h6>
                            </div>
                        </div>
                    </div>
                </div>
                    <div class="template-form align-content-center">
                        <div class="mt-form-row pt-1">
                            <label for="formSelect1">Select the number to register for Email forwarding.</label>
                            <select class="custom-select" id="formSelect1">
                                <option>{{this.$props.ownNumber}}</option>
                            </select>
                        </div>
                        <div class="mt-form-row">
                            <label class="category-desc" for="emailInput">Email Address to forward messages to.</label>
                            <div class="area-for-text input-group"> 
                                <input type="email" class="form-control" id="emailInput" v-model="emailAddress" />
                                <div class="input-group-append">
                                    <button class="btn btn-primary" @click="submitEmailForwardingRegisterRequest">Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>                     <label v-if="!selectedConvo" class="">  Forward new text messages to your Email</label>
</div>
                    <div><button class="btn btn-danger mb-1" @click="submitEmailForwardingDeregisterRequest">Unregister</button></div>
                    <div><label v-if="emailVerified" >✓ Email Forwarding set up.</label></div>
                </div>
            </div>
        
</template>
<style scoped>
#EMAIL_FORWARD {
    grid-column-start: 2;
    grid-column-end: 2;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto auto auto;
}
.center{
    grid-column-start: 1;
    grid-row-start: 1;
    align-self: center;
    justify-self: center;
}

@media screen and (width <=700px) {
    #NO_MESSAGES{
        display:none;
    }
    #EMAIL_FORWARD {
        grid-column-start: 1;
        grid-column-end: 2;
    }
}

</style>