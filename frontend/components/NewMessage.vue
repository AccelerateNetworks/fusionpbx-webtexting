<script lang="js">
import SendBox from './SendBox/SendBox.vue';
export default {
    name: 'NewMessage',
    components: { SendBox },
    props:{
        ownNumber: String
    },
        data() {
            return {
                number: '',
            }
        }
}

</script>
<template>
        <div id="NEW_MESSAGE">
            <div class="thread-header">
                <a class="back-link" href="/app/webtexting" aria="Go Back to threadlist!">←</a>
                <p>New Conversation</p>
            </div>
        <span class='new-thread-message'>Enter Number:
            <input type="text" v-model="number" id="new-thread-number" placeholder="(206) 555-1212" />
        </span>
        <SendBox :remoteNumber="number" :ownNumber="ownNumber" />
    </div>
</template>

<style>
#NEW_MESSAGE {
    grid-column-start: 2;
    grid-column-end: 2;
    height: 83vh;
}



@media screen and (width <=700px) {
    #NEW_MESSAGE {
        z-index: 5;
        grid-column-start: 1;
        grid-column-end: 1;
        height:94vh;
    }
}
</style>
