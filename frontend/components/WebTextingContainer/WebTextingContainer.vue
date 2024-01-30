<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue';
import {ThreadPreviewInterface} from '../ThreadPreview/ThreadPreview.vue';
import moment from 'moment';
import NewMessage from '../NewMessage.vue';
import { RouterView } from 'vue-router';
import { emitter,MessageData,ThreadChangePayload } from '../../lib/global';


//TODO: changing threads and threadpreviews to Map<String,Object>
//      this should change how ThreadList/ThreadPreview and Conversation components interact with the threads and threadPreviews props
export default {
    name: 'WebTextingContainer',
    props: {
        ownNumber: String,
        username: String,
        threads: Array<Object>,
        threadPreviews: Map<String,ThreadPreviewInterface>
    },
    computed: {
        conversationSelected() {
            let selectedConvo = false;
            if (this.$route.query.number || this.$route.query.group) {
                selectedConvo = true;
            }
            return selectedConvo;
        },
        newThreadSelected(){
            let newThreadSelected= false;
            if(this.$route.path === ("/createthread.php")){
                newThreadSelected= true;
            }
            return newThreadSelected;
        },
    },
    components: { Conversation, ThreadList },
    data(){
        let contactEditLink = null;
        let title=''
        return {contactEditLink,title};
    },
    methods: {
        calculateDisplayName() {
            if (this.$route.query.group) {
                for (let m in this.$props.threadPreviews) {
                    console.log(`group: ${m}`);
                }
            }
            else {
                for (let m in this.$props.threadPreviews) {
                    console.log(`contact: ${m}`);
                }
            }
            console.log("display name calculated");
            return "tested";
        },
        updateLastMessage(message:MessageData){
            console.log(`ULM: `);
           // const timezoneOffset = new Date().getTimezoneOffset();
           // console.log(timezoneOffset)
            let now:Moment =  moment.utc(Date.now());
            //console.log(now);
            //const timestamp:Date = now.toUTCString();
            //now = now + timezoneOffset;
            //console.log(message)
            if(message.contentType == "message/cpim"){
                //console.log(message.cpim.headers['group-uuid']);
               // console.log(this.threadPreviews.get(message.cpim.headers['group-uuid']));
                //bump this thread somehow?
                //this mightnot work for a new message 
                // console.log(message.cpim.headers["group-uuid"])
                // console.log(message.cpim.headers["Group-UUID"])
                // console.log(message.cpim.headers['Group-UUID'])
                 console.log(message.cpim.headers['group-uuid'])

                
                    //outbound message case
                    if(message.direction == 'outgoing'){
                        if(message.cpim.headers['group-uuid'] ){
                            let temp = this.threadPreviews.get(message.cpim.headers['group-uuid']);
                            temp.bodyPreview = "New MMS Message";
                            temp.timestamp = now;
                            this.threadPreviews.set(message.cpim.headers['group-uuid'], temp);
                        }else if(message.cpim.headers["Group-UUID"]){
                            let temp = this.threadPreviews.get(message.cpim.headers['Group-UUID']);
                            temp.bodyPreview = "New MMS Message";
                            temp.timestamp = now;
                            this.threadPreviews.set(message.cpim.headers['Group-UUID'], temp);
                        }
                        else{
                            if(this.$route.query.number){
                                let temp = this.threadPreviews.get(this.$route.query.number);
                                console.log(this.threadPreviews.get(this.$route.query.number), " ", this.$route.query.number);
                                temp.bodyPreview = "New MMS Message";
                                temp.timestamp = now;
                                this.threadPreviews.set(this.$route.query.number, temp);
                            }
                            
                        }
                        
                        
                    }
                    else if(message.direction == 'incoming'){
                        let temp = this.threadPreviews.get(message.from);
                        console.log(this.threadPreviews.get(message.from), " ", message.from);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        

                        this.threadPreviews.set(message.from, temp);
                    }
            }
            else{
                //console.log("not message.cpim")
                if(message.from == this.ownNumber){
                    //console.log(this.threadPreviews.get(message.to))
                    //set this.threadPreviews.get(message.to)bodyPreview to message.body
                    if(this.threadPreviews.get(message.to)){
                        let temp = this.threadPreviews.get(message.to);
                        temp.bodyPreview = message.body;
                        temp.timestamp = now;
                        this.threadPreviews.set(message.to, temp);
                    }
                    
                }
                else if(message.to == undefined){
                   // console.log(this.threadPreviews.get(message.from))
                                        //set this.threadPreviews.get(message.from)bodyPreview to message.body
                    if(this.threadPreviews.get(message.from)){
                        let temp = this.threadPreviews.get(message.from);
                        temp.bodyPreview = message.body;
                        temp.timestamp = now;

                        this.threadPreviews.set(message.from, temp);
                    }

                }
            }
            this.$forceUpdate();
        }
    },
    watch:{
        threadPreviews:{
            handler(oldPreviews,newPreviews){
                console.log("wtc thread previews changed");
        },
            deep:true,
        }
        
    },
    mounted() {
        emitter.on('thread-change', (payload:ThreadChangePayload ) => {
            this.contactEditLink = payload.editLink;
            console.log(`wtc thread change ${payload.key}`)
            this.title= payload.key;
            emitter.emit('thread-changed', payload.key);
        });
        emitter.on("new-message-ingested", (message:MessageData) =>{
            //console.log(`Message: ${message.body}`);
            //console.log("time to fetch");
        });
        emitter.on("update-last-message",(message:MessageData) =>{
            this.updateLastMessage(message);
            
        });
        //need a function that takes the new message ingested and replaces the corresponding threadPreview.text
    },

}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <RouterView>


        <div id="WEB_TEXT_ROOT">
            
            <RouterView name="leftSide" :ownNumber="this.$props.ownNumber" :threads="this.$props.threads"
                :threadPreviews="this.threadPreviews" 
                :selectedConvo="this.conversationSelected"
                :newThreadView="this.newThreadSelected"/>


            <suspense> 
                <RouterView name="rightSide" 
                    :extension_uuid="this.$route.query.extension_uuid"
                    :remoteNumber="this.$route.query.number" 
                    :groupUUID="this.$route.query.group"
                    :ownNumber="this.$props.ownNumber" 
                    :displayName="this.title"
                    :selectedConvo="this.conversationSelected" 
                    :contactEditLink="contactEditLink"
                    :title="this.title"
                     />
            </suspense>
            <link type="text/css" href="../../../js/style.css">
        </div>
    </RouterView>
</template>

<style>
::-webkit-scrollbar {
    width: 10px;
    height:10px;
    padding-top:3px;
    background-color: white;
}



::-webkit-scrollbar-thumb {
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 6px rgba(255,255,255,0.5); 
    background-color: #BB6025;
}
@media screen and (width<=700px){
    #main_content{
        margin-top:48px;
        border-radius:0;
        -webkit-border-radius:0;
    }
    #TEST_DIV_FOR_TESTING_WEBTEXTING{
        height:93vh;
    }
} 
@media screen and (width<=575px){
    .navbar-toggler{
        background-color: #3178B1;
    }

}


</style>