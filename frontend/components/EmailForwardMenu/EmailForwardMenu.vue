<script lang="ts">
import {emitter} from '../../lib/global';
export default{
    name:"ForwardingPlaceholder",
    props:{
        selectedConvo: Boolean,
    },
    data(){
        return{
            emailForwardFormInputs:{
                phoneNumber:'',
                emailAddress:''
            }
        }
    },
    methods: {
        submitEmailForwardingRegisterRequest(){
            event.preventDefault();
            const params = {
                email_address: this.$data.emailForwardFormInputs.emailAddress.trim(),
                own_number: this.$data.emailForwardFormInputs.phoneNumber.trim()
            }
            emitter.emit("register-email-forwarding",params);
        }
    },
}
</script>
<template>
    <div id="NO_MESSAGES" >
            <p v-if="!selectedConvo" class="center">  Forward new text messages to your Email</p>
            <div class="template-form ">
                <div class="mt-form-row">
                    <div class="category-template-uuid">Your phone number</div>
                    <div class="area-for-text"> <textarea v-model="emailForwardFormInputs.phoneNumber"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Email Address to forward messages to.</div>
                    <div class="area-for-text"> <textarea v-model="emailForwardFormInputs.emailAddress"></textarea></div>

                </div>
                <button class="submit" @click="submitEmailForwardingRegisterRequest">Submit</button>
                </div>
    </div>
</template>
<style scoped>
#NO_MESSAGES {
    grid-column-start: 2;
    grid-column-end: 2;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
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
}

</style>