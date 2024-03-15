<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue';
import { ThreadPreviewInterface } from '../ThreadPreview/ThreadPreview.vue';
import moment from 'moment';
import NewMessage from '../NewMessage.vue';
import { RouterView } from 'vue-router';
import {useMatchMedia} from '../../lib/matchMedia';
import { emitter, MessageData, ThreadChangePayload,state} from '../../lib/global';
import {searchPreviews,loadPreviews} from '../../lib/backfillPreviews';

//TODO: changing threads and threadpreviews to Map<String,Object>
//      this should change how ThreadList/ThreadPreview and Conversation components interact with the threads and threadPreviews props
export default {
    name: 'WebTextingContainer',
    props: {
        ownNumber: String,
        username: String,
        threads: Array<Object>,
        extensionUUID: String,
        threadPreviews: Map<String, ThreadPreviewInterface>
    },
    computed: {
        conversationSelected() {
            let selectedConvo = false;
            if (this.$route.query.number || this.$route.query.group) {
                selectedConvo = true;
            }
            return selectedConvo;
        },
        newThreadSelected() {
            let newThreadSelected = false;
            if (this.$route.path === ("/createthread.php")) {
                newThreadSelected = true;
            }
            return newThreadSelected;
        },
    },
    components: { Conversation, ThreadList },
    data() {
        let contactEditLink = null;
        let title = '';
        let smallScreen = useMatchMedia('(width<=700px)');
        let loadedPreviews = false;
        return { contactEditLink, title, smallScreen, state:state, previews: state.previews, loadedPreviews };
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
        updateLastMessage(message: MessageData) {
            console.log(`ULM: `);
            // const timezoneOffset = new Date().getTimezoneOffset();
            // console.log(timezoneOffset)
            let now: Moment = moment.utc(Date.now());
            //console.log(now);
            //const timestamp:Date = now.toUTCString();
            //now = now + timezoneOffset;
            //console.log(message)
            if (message.contentType == "message/cpim") {
                //console.log(message.cpim.headers['group-uuid']);
                // console.log(this.threadPreviews.get(message.cpim.headers['group-uuid']));
                //bump this thread somehow?
                //this mightnot work for a new message 
                // console.log(message.cpim.headers["group-uuid"])
                // console.log(message.cpim.headers["Group-UUID"])
                // console.log(message.cpim.headers['Group-UUID'])
                console.log(message.cpim.headers['group-uuid'])


                //outbound message case
                if (message.direction == 'outgoing') {
                    if (message.cpim.headers['group-uuid']) {
                        let temp = this.threadPreviews.get(message.cpim.headers['group-uuid']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.threadPreviews.set(message.cpim.headers['group-uuid'], temp);
                    } else if (message.cpim.headers["Group-UUID"]) {
                        let temp = this.threadPreviews.get(message.cpim.headers['Group-UUID']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.threadPreviews.set(message.cpim.headers['Group-UUID'], temp);
                    }
                    else {
                        if (this.$route.query.number) {
                            let temp = this.threadPreviews.get(this.$route.query.number);
                            console.log(this.threadPreviews.get(this.$route.query.number), " ", this.$route.query.number);
                            temp.bodyPreview = "New MMS Message";
                            temp.timestamp = now;
                            this.threadPreviews.set(this.$route.query.number, temp);
                        }

                    }
                }
                else if (message.direction == 'incoming') {
                    if (message.cpim.headers['group-uuid']) {
                        let temp = this.threadPreviews.get(message.cpim.headers['group-uuid']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.threadPreviews.set(message.cpim.headers['group-uuid'], temp);
                    } else if (message.cpim.headers["Group-UUID"]) {
                        let temp = this.threadPreviews.get(message.cpim.headers['Group-UUID']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.threadPreviews.set(message.cpim.headers['Group-UUID'], temp);
                    }
                    else {
                        if (this.$route.query.number) {
                            let temp = this.threadPreviews.get(this.$route.query.number);
                            console.log(this.threadPreviews.get(this.$route.query.number), " ", this.$route.query.number);
                            temp.bodyPreview = "New MMS Message";
                            temp.timestamp = now;
                            this.threadPreviews.set(this.$route.query.number, temp);
                        }

                    }
                }
            }
            else {
                //console.log("not message.cpim")
                if (message.from == this.ownNumber) {
                    //console.log(this.threadPreviews.get(message.to))
                    //set this.threadPreviews.get(message.to)bodyPreview to message.body
                    if (this.threadPreviews.get(message.to)) {
                        let temp = this.threadPreviews.get(message.to);
                        temp.bodyPreview = message.body;
                        temp.timestamp = now.toString();
                        this.threadPreviews.set(message.to, temp);
                    }

                }
                else if (message.to == undefined) {
                    // console.log(this.threadPreviews.get(message.from))
                    //set this.threadPreviews.get(message.from)bodyPreview to message.body
                    if (this.threadPreviews.get(message.from)) {
                        let temp = this.threadPreviews.get(message.from);
                        temp.bodyPreview = message.body;
                        temp.timestamp = now.toString();

                        this.threadPreviews.set(message.from, temp);
                    }

                }
            }
            this.$forceUpdate();
        }
    },
    watch: {
        threadPreviews: {
            handler(oldPreviews, newPreviews) {
                console.log("wtc thread previews changed");
            },
            deep: true,
        },
        smallScreen:{
            handler(oldScreen, newScreen){
                let smallScreen = useMatchMedia('(max-width<=700px)');
                console.log("smallscreen handler")
                if(smallScreen){
                    let pullToRefresh = document.querySelector('.pull-to-refresh');
                }
                else{
                    let pullToRefresh = false;
                }
            }
        }

    },
    async created() {
        //getPreviews();
        console.log(this.state);
        loadPreviews(this.extensionUUID);
    },
    mounted() {
        console.log(this.$route.query.extension_uuid);
        emitter.on('thread-change', (payload: ThreadChangePayload) => {
            this.contactEditLink = payload.editLink;
            console.log(`wtc thread change ${payload.key}`)
            this.title = payload.key;
            emitter.emit('thread-changed', payload.key);
        });
        emitter.on("new-message-ingested", (message: MessageData) => {
            //console.log(`Message: ${message.body}`);
            //console.log("time to fetch");
        });
        emitter.on("update-last-message", (message: MessageData) => {
            this.updateLastMessage(message);

        });
        emitter.on("thread-search-request", async (queryString: string) =>{
            if(this.$route.query.extension_uuid){
                this.loaded = false;
                this.loadedPreviews = false;
                console.log("we've got a route")
                searchPreviews(queryString,this.$route.query.extension_uuid);
                console.log(this.state.previews);
            }
            else{
                alert("No Extension detected. Reload the page")
            }
        });
        emitter.on("previews-built-and-loaded",() =>{
            this.loadedPreviews=true;
            this.load = true;
        });
        
    },

}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <RouterView>


        <div id="WEB_TEXT_ROOT">
        <div v-if="smallScreen" class="pull-to-refresh"><div class="spinner-border"></div></div>
            <RouterView name="leftSide" :ownNumber="this.$props.ownNumber" :threads="this.$props.threads"
                :threadPreviews="this.state.previews" :previewsLoaded="this.loadedPreviews" :selectedConvo="this.conversationSelected"
                :newThreadView="this.newThreadSelected" />


            <suspense>
                <RouterView name="rightSide" :extension_uuid="this.$route.query.extension_uuid"
                    :remoteNumber="this.$route.query.number" :groupUUID="this.$route.query.group"
                    :ownNumber="this.$props.ownNumber" :displayName="this.title" :selectedConvo="this.conversationSelected"
                    :contactEditLink="contactEditLink" :title="this.title" />
            </suspense>
            <link type="text/css" href="../../../js/style.css">
        </div>
    </RouterView>
</template>

<style>
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    padding-top: 3px;
    background-color: white;
}



::-webkit-scrollbar-thumb {
    border-radius: 6px;
    -webkit-box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.5);
    background-color: #BB6025;
}

.bgc-AN-orange {
    background: #BB6025;
}

.bgc-AN-blue{
    background:  #3178B1;
}

.bgc-none {
    background: none;
}
#TEST_DIV_FOR_TESTING_WEBTEXTING {
    height: 85vh;
}


@media screen and (width<=700px) {
    #main_content {
        margin-top: 48px;
        border-radius: 0;
        -webkit-border-radius: 0;
    }

    #TEST_DIV_FOR_TESTING_WEBTEXTING {
        height: 93vh;
    }
    .pull-to-refresh {
        z-index:-1;
        position: fixed;
        top: 50px;
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: top 0.7s ease-in-out;
      }
      .pull-to-refresh.visible {
        top: 0;
        z-index:1;
      }
}


</style>