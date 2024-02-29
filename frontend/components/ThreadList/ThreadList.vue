<script lang="ts" >
import ThreadSearch from '../ThreadSearch/ThreadSearch.vue';
import ThreadPreview, { ThreadPreviewInterface } from '../ThreadPreview/ThreadPreview.vue';
import {emitter, ThreadChangePayload} from '../../lib/global'



export default {
    name: 'ThreadList',

    props: {
        displayName: String,
        ownNumber: String,
        threads: Array<Object>,
        threadPreviews: Map<String, ThreadPreviewInterface>,
        selectedConvo: Boolean,
        newThreadView: Boolean
    },
    components: { ThreadPreview, ThreadSearch },
    data() {
        return { activeThread: '',
                    filterString: '',
                    displaySearch: false }
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
    mounted(){
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
    },
    methods:{
        dumpSelectedThread(){
            const newThread = {key:'', editLink:null}
            emitter.emit('thread-change',newThread);
        },
        filteredPreviews(){
            return new Map([...this.threadPreviews].filter(  ([key,value]) => { 
                //console.log(value)
                if(value==null){
                    console.log("key for null value ", key)
                    return false;
                }
                else if(value.displayName == null){
                    console.log("key for null value.displayName" , key)
                    return false;
                }
                return value.displayName.toLowerCase().includes(this.filterString.toLowerCase())}
            
                
        )
            );
        }
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
                <a id="notification-btn" role="button" class="fas fa-bell-slash fa-fw f btn btn-large" onclick="toggleNotifications()" aria-label="toggle notifications"></a>
            </div>
        </div>
        <ThreadSearch v-if='true'></ThreadSearch>
        <div class='threadlist-table'>
            <div class="preview_list_container">
                <ThreadPreview  v-for="[key,value] in filteredPreviews()" :key="key"
                    v-bind="value" :activeThread="this.activeThread"  />
            </div>
        </div>
        <div class="link-container">
            <router-link :to="'/createthread.php'" class="thread-link dot-center dot bgc-none" aria-label="new contact" @click="dumpSelectedThread()">＋</router-link>
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
    height: 70vh;
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



    @media screen and (width <=700px) {    
    div.action_bar {
        top: 0px;
    }
    .active{
        z-index:7;
    }
    .table {
        height: 80vh;
    }
    .hide-if-small{
        display:none;
    }
}
</style>