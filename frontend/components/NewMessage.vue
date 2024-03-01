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
    },
    mounted() {
        let touchstartY = 0;
        const refreshElement = document.getElementsByClassName("thread-header")[0];
        refreshElement.addEventListener('touchstart', e => {
            touchstartY = e.touches[0].clientY;
        });
        refreshElement.addEventListener('touchmove', e => {
            const touchY = e.touches[0].clientY;
            const touchDiff = touchY - touchstartY;
            let pullToRefresh = document.querySelector('.pull-to-refresh');
            if (touchDiff > 0 && window.scrollY === 0 && pullToRefresh) {
                pullToRefresh.classList.add('visible');
                //e.preventDefault();
            }
        });
        refreshElement.addEventListener('touchend', e => {
            console.log("touch end")
            let pullToRefresh = document.querySelector('.pull-to-refresh');
           
        if (pullToRefresh && pullToRefresh.classList.contains('visible')) {
            pullToRefresh.classList.remove('visible');
            location.reload();
        }
        });
    },
    beforeDestroy() {
        const refreshElement = document.getElementsByClassName("thread-header")[0];
        refreshElement.removeEventListener('touchend', e );
        refreshElement.removeEventListener('touchmove', e );
        refreshElement.removeEventListener('touchestart', e );
    },
}

</script>
<template>
        <div id="NEW_MESSAGE">
            <div class="new-message-container">
                <div class="thread-header new-message-header">
                    <div class="thread-header-container  d-flex justify-content-between align-items-center">
                        <div>
                            <router-link class="back-link fa fa-arrow-left btn btn-large " :to="`/threadlist.php?extension_uuid=${this.$route.query.extension_uuid}`" aria="Go Back to threadlist!"></router-link>
                        </div>
                        <div>
                            <div class="new-message-headline"><h6>New Conversation</h6></div>

                        </div>
                    </div>
                </div>
                <span class='new-thread-message'>Enter Number:
                    <input type="number" size="11" min="10000000000" max="19999999999" v-model="number" id="new-thread-number" name="new-thread-number" placeholder="12065551212" />
                </span>
                <br>
                <br>
                <label for="new-thread-number">Outbound Number must include Country Code and Area Code:</label>
                <SendBox :remoteNumber="number" :ownNumber="ownNumber" location="New-Message"/>    
            </div>
        </div>
   
</template>

<style>
#NEW_MESSAGE {
    grid-column-start: 2;
    grid-column-end: 2;
    height: 83vh;
    border-radius:0.5rem;   
}
.new-message-header{
    border-radius:0.5rem;
}
.thread-header-container{
    display:flex;
    align-items: center;
}
.new-message-headline{
    align-items: center;
    padding-left: 1rem;
}

.new-message-container{
    border: 2px solid #5f9fd3;
    border-radius: 0.5rem;
    padding: 0.5rem;
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
