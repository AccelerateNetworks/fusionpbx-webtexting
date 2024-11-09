<script lang="ts">
import {emitter} from '../../lib/global';
export default{
    name:"ForwardingPlaceholder",
    props:{
        selectedConvo: Boolean,
        ownNumber: String
    },
    data(){
        return{
            emailForwardFormInputs:{
                phoneNumber:this.$props.ownNumber,
                emailAddress:''
            }
        }
    },
    methods: {
        submitEmailForwardingRegisterRequest(){
            event.preventDefault();
            const params = {
                email: this.$data.emailForwardFormInputs.emailAddress.trim(),
                dialedNumber: this.$props.ownNumber
            }
            emitter.emit("register-email-forwarding",params);
        },
        backArrowClickHandler() {
            emitter.emit('menu-change');
        },
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
    
                            <div class="">
                                <h6 class="mb-0">Email Forwarding</h6>
                            </div>
    
                        </div>
                    </div>
                </div>
                    <div class="template-form align-content-center">
                        <div class="mt-form-row">
                            <label for="formSelect1">Select the number to register for Email forwarding.</label>
                            <select id="formSelect1">
                                <option>{{this.$props.ownNumber}}</option>
                            </select>
                        </div>
                        <div class="mt-form-row">
                            <div class="category-desc">Email Address to forward messages to.</div>
                            <div class="area-for-text"> <textarea v-model="emailForwardFormInputs.emailAddress"></textarea></div>

                        </div>
                        <button class="submit" @click="submitEmailForwardingRegisterRequest">Submit</button>
                    </div>
                    <p v-if="!selectedConvo" class="">  Forward new text messages to your Email</p>
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