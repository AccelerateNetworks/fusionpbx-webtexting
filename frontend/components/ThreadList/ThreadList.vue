<script lang="ts" >
import ThreadSearch from '../ThreadSearch/ThreadSearch.vue';
import ThreadPreview, { ThreadPreviewInterface } from '../ThreadPreview/ThreadPreview.vue';
import PaginatorButton from '../PaginatorButton/PaginatorButton.vue';
import {emitter, ThreadChangePayload} from '../../lib/global';




export default {
    name: 'ThreadList',

    props: {
        displayName: String,
        ownNumber: String,
        threads: Array<Object>,
        threadPreviews: Map<String, ThreadPreviewInterface>,
        selectedConvo: Boolean,
        newThreadView: Boolean,
        previewsLoaded: Boolean
    },
    components: { ThreadPreview, ThreadSearch, PaginatorButton },
    data() {
        return { activeThread: '',
                    filterString: '',
                    displaySearch: false,
                    loaded: false,
                    backfillPreviewAvailable: true,}
    },
    computed: {
        recieveEmit(threadChangeObject:ThreadChangePayload) {
            //console.log(`active conversation: ${activeConversation}`);
            this.activeThread = threadChangeObject.key;
            return this.activeThread;
        },
        
    },
    watch:{
        threadPreviews:{
            handler(oldPreviews,newPreviews){
            console.log("threadlist thread previews changed");
        },
            deep:true,
        }
        
    },
    async created(){
        //this.threadPreviews = await this.threadPreviews;
        if (this.threadPreviews){
            this.loaded = true;
        }
        
    },
    methods:{
        dumpSelectedThread(){
            const newThread = {key:'', editLink:null}
            emitter.emit('thread-change',newThread);
        },
        filteredAndSortedPreviews() {
            if(this.loaded && this.threadPreviews){            
                return new Map<String,ThreadPreviewInterface>([...this.threadPreviews].filter(([key, value]) => {
                    //console.log(value)
                    if (value == null) {
                        console.log("key for null value ", key)
                        return false;
                    }
                    else if (value.displayName == null) {
                        console.log("key for null value.displayName", key)
                        return false;
                    }
                    //or contains number fragment
                    //console.log(typeof key , key)
                    return (value.displayName.toLowerCase().includes(this.filterString.toLowerCase()) || key.includes(this.filterString))
                }
                )
                .sort(function(a,b) {

                   return Date.parse(b[1].timestamp) - Date.parse(a[1].timestamp) ;

                })
                );
        }
        else{
            return new Map<string,ThreadPreviewInterface>();
        }
    },

        
        
    },
    mounted(){
        
        
        let touchstartY = 0;
        const refreshElement = document.getElementsByClassName("threadlist-header")[0];
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
        emitter.on('thread-change', (threadChangeObject:ThreadChangePayload) => {
            //console.log("TL event get", activeConversation);
            this.activeThread = threadChangeObject.key;
            return this.activeThread;
        })
        emitter.on("update-last-message", ()=>{
            const temp = this.activeThread;
            this.activeThread = "";
            this.activeThread = temp;

        })
        emitter.on("update-filter-string",(filterString)=>{
            this.filterString = filterString;
        });
        emitter.on("previews-loading",()=> {
            this.loaded= false;
        })
        emitter.on("previews-done-loading",()=>{
            console.log("loaded" );
            this.loaded= null;
            this.loaded = true;
        })
            
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

    <div class="threadlist_container active" id="THREADLIST" v-bind:class="(selectedConvo || newThreadView) ? 'hide-if-small': 'no-convo-selected'">
        <div class="threadlist-header d-flex justify-content-between align-items-center"> 
            <!-- <div class="m-auto">
                <a class="fas fa-info-circle fa-fw menu-icon btn btn-large" aria-label="Accelerate Networks support page" role="link" target="_blank" href="https://acceleratenetworks.com/support/"></a>
            </div> -->
            <div class="ml-05">
                <h6 class="m-auto">Conversations</h6>
            </div>
            <div class="mr-05">
                <router-link to="/menu.php" id="SETTINGS-BTN" role="button" class="fas fa-cog f btn btn-large"> </router-link>
                <a id="notification-btn" role="button" class="fas fa-bell-slash fa-fw f btn btn-large" onclick="toggleNotifications()" aria-label="toggle notifications"></a>
            </div>
        </div>
        <ThreadSearch v-if='true'></ThreadSearch>
        <div class='threadlist-table'>
            <div class="preview_list_container">

                <div class="conditional_container" v-if="this.loaded" ref="conditional_container" @scroll="onScroll">
                    <ThreadPreview   v-for="[key,value] in filteredAndSortedPreviews()" :key="key"
                    v-bind="value" :activeThread="this.activeThread"  />
                    
                </div>
                <div class="load-animation-container" v-else>
                    <img src="../../../loading-spinner.svg" alt="loading animation" width="150" height="150"/>
                </div>
                <PaginatorButton/>
            </div>
        </div>
        <div class="link-container-container">
            <div class="link-container">
                <router-link :to="'/createthread.php'" class="thread-link dot-center dot bgc-none fa fa-plus" aria-label="new contact" @click="dumpSelectedThread()"></router-link>
            </div>
        </div>
        
    </div>
</template>
<style>
.ml-05{
    margin-left:5%;
}
.mr-05{
    margin-right:5%;
}
/*body{
    cursor:pointer;
} */
.menu-icon{
    color:white;
}
.menu-icon:hover{
    color:#BB6025;
}
.float-right{
    position:absolute;
    top: 50%;
    float:right;
}

.active{
    grid-column-start: 1;
}
.preview_list_container {
    direction: ltr;
}
.threadlist_container {
    height: 100%;
    grid-column-start: 1;
    grid-column-end: 1;
    padding-right: 0.25rem;
    border-radius: 0.5rem;
    border-color: none;
}
.hide-if-small{
}

.threadlist-header{
    box-shadow: 0 4px 4px -2px white;
    margin: 0 auto 0px auto;
    padding-top: 0.75rem;
    padding-bottom: 0.25rem;
    background-color: #5f9fd3;
    color: #fff;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
    font-weight: bold;
    border: solid #5f9fd3 2px;
}

.threadlist-table {
    /*border-spacing: 1em; */
    direction: rtl;
    overflow-y: auto;
    height: 69dvh;
    width: 100%;
    table-layout: fixed;
    padding-left: 3px;
}
.link-container{
    font-size: 2rem;
    line-height: 2rem;
    height: 3rem;
    width: 3rem;
    background-color: #5f9fd3;
    border-radius: 50%;
    position:relative;
    float: center;
    margin-top: 0.5rem;
}

.dot-center{
    text-align:center;
     margin: 0;
     position: absolute;               
     top: 50%;                         
     left: 50%;
     transform: translate(-50%, -50%) ; 
}
.dot {    
     
         border-radius: 50%;
         -moz-border-radius: 50%;
         -webkit-border-radius: 50%;
         color: #ffffff;
         display: inline-block;
         font-weight: bold;
         line-height: 22px;
         margin-right: 5px;
         text-align: center;
 
 }
 .dot:hover{
     color:#BB6025;
 }

 .link-container-container{
    justify-content: center;
    display:flex;
}
.load-animation-container{
    display: flex;
    justify-content: center;
    align-items: center;
}



    @media screen and (width <=700px) {    
    div.action_bar {
        top: 0px;
    }
    .active{
        z-index:7;
    }
    .table {
        height: 79dvh;
    }
    .hide-if-small{
        display:none;
    }
    
}
</style>