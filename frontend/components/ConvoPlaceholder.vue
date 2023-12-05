<script lang="js">
import SendBox from './SendBox/SendBox.vue';
export default {
    name: 'ConvoPlaceholder',
    components: { SendBox },
        data() {
            return {
                number: '',
            }
        }
}

</script>
<template>
    <div id="CONVERSATION_PLACEHOLDER">
        <span class='modal-message'>Enter Number:
            <input type="text" v-model="number" id="new-thread-number" placeholder="(206) 555-1212" />
        </span>
        <p> I am in hell and this is my punishment for incredible hubris (btw your input value is: {{ number }}).
        </p>
        <SendBox/>
    </div>
</template>

<style>
#CONVERSATION_PLACEHOLDER {
    grid-column-start: 2;
    grid-column-end: 2;
    height: 83vh;
}

#conversation {
    grid-column-start: 2;
    grid-column-end: 2;
}

@media screen and (width <=700px) {
    /*   #conversation{ 
        display: none;
    }
*/
}
</style>