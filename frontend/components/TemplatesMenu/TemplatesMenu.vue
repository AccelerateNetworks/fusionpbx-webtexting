<script lang="ts">
import {emitter} from '../../lib/global';

export default {
    name: 'TemplatesMenu',
    emits:{
        'leave-menu':String
    },
    methods:{
        backArrowClickHandler() {
            emitter.emit('menu-change');
        }
    }

}
</script>
<template>
    <div id="TEMPLATES_MENU">
        <div class="templates-container">
            <div class="thread-header new-message-header">
                <div class="thread-header-container  d-flex justify-content-between align-items-center">
                    <div class="'ml-05">
                        <router-link class="fa fa-arrow-left btn btn-large "
                            :to="`/menu.php`" @click="backArrowClickHandler"
                            aria="Go Back to Settings Menu"></router-link>
                    
                        <div class="new-message-headline">
                            <h6>Templates</h6>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media screen and (width <=700px) {
    #THREAD {
        z-index: 5;
        grid-column-start: 1;
        grid-column-end: 1;
        height: 91vh;
    }

    .thread-container {
        height: 90vh;
    }

    .messages {
        height: 80vh;
    }

}
</style>