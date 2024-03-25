<script lang="ts" >

import {emitter,state, updatePageNumber} from '../../lib/global';
export default{
    name:'PaginatorButton',
    props:{
    },
    data(){
        return {oldestMessage: state.oldestMessage,
                morePreviewsAvailable: true}
    },
    methods:{

    funnyClickFunction(){
            const buttonData = document.getElementById('MORE-PREVIEWS');
            console.log("Button data:  ", buttonData);
            emitter.emit("backfill-previews-requested");
            console.log(state.page);
            console.log(updatePageNumber());

        },
    },
    mounted() {
        emitter.on("no-more-previews", ()=>{
            console.log("all done loading previews")
            this.morePreviewsAvailable = false;
        })
    },

}
</script>
<template>
    <div class="paginator_container" >
        
        <a id='MORE-PREVIEWS' class="paginator" role="button" v-if="this.morePreviewsAvailable" @click="funnyClickFunction" :data-oldest-message="oldestMessage">
            <span class="paginator-link">Load More</span>
        </a>

    </div>
</template>
<style scoped>
.paginator{
    font-size: 1.5rem;
    display:flex;
    justify-content: center;
}
.paginator-link{
    color: #3178B1;
    margin-left:auto;
    margin-right:auto;
}
.paginator-link:hover{
    text-decoration: underline;
}
</style>