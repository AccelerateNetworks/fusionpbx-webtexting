<script lang="ts">
import Conversation from '../conversation/Conversation.vue';
import ThreadList from '../ThreadList/ThreadList.vue';
import moment from 'moment';
import NewMessage from '../NewMessage.vue';
import { RouterView } from 'vue-router';
import { saveTemplate, saveTemplateQuery, } from '../../lib/saveTemplates';
import { useMatchMedia } from '../../lib/matchMedia';
import { emitter, MessageData, ThreadChangePayload, state, ThreadPreviewData } from '../../lib/global';
import { searchPreviews, loadPreviews } from '../../lib/backfillPreviews';
import { loadTemplates, loadTemplateQuery } from '../../lib/loadTemplates';
import { deleteTemplateQuery, deleteTemplate } from '../../lib/deleteTemplate';
import { registerForwardAddress, registerForwardingRequest } from '../../lib/messageForwarding';
import AlertFactory from '../Alerts/AlertFactory.vue';
import { checkIfForwardedAddress, checkForwardingRequest } from '../../lib/checkIfForwarded';
import { ForwardingCheckResponseObject } from '../EmailForwardMenu/EmailForwardMenu.vue';

//this component kind of functions as a partial state controller for the app
export default {
    name: 'WebTextingContainer',
    props: {
        ownNumber: String,
        username: String,
        threads: Array<Object>,
        extensionUUID: String,
        threadPreviews: Map<String, ThreadPreviewData>,
        multipleWebTextingExtensions: Boolean,
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
    components: { Conversation, ThreadList, AlertFactory },
    data() {
        let contactEditLink = null;
        let title = '';
        let threadUUID = '';
        let smallScreen = useMatchMedia('(width<=700px)');
        let loadedPreviews = false;
        let remoteNumber = '';
        let email = '';
        let emailVerified = ''
        return { contactEditLink, title, smallScreen, state: state, previews: state.previews, loadedPreviews, threadUUID, email, emailVerified };
    },
    methods: {
        calculateDisplayName() {
            if (this.$route.query.group) {
                for (let m in this.state.previews) {
                    //console.log(`group: ${m}`);
                }
            }
            else {
                for (let m in this.state.previews) {
                    //console.log(`contact: ${m}`);
                }
            }
            //console.log("display name calculated");
            return "tested";
        },
        updateLastMessage(message: MessageData) {
            // const timezoneOffset = new Date().getTimezoneOffset();
            let now: moment.Moment = moment.utc(Date.now());
            //const timestamp:Date = now.toUTCString();
            //now = now + timezoneOffset;
            if (message.contentType == "message/cpim") {
                //outbound message case
                if (message.direction == 'outgoing') {
                    if (message.cpim.headers['group-uuid']) {
                        let temp = this.state.previews.get(message.cpim.headers['group-uuid']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.state.previews.set(message.cpim.headers['group-uuid'], temp);
                    } else if (message.cpim.headers["Group-UUID"]) {
                        let temp = this.state.previews.get(message.cpim.headers['Group-UUID']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.state.previews.set(message.cpim.headers['Group-UUID'], temp);
                    }
                    else {
                        if (this.$route.query.number) {
                            let temp = this.state.previews.get(this.$route.query.number);
                            //console.log(this.state.previews.get(this.$route.query.number), " ", this.$route.query.number);
                            temp.bodyPreview = "New MMS Message";
                            temp.timestamp = now;
                            this.state.previews.set(this.$route.query.number, temp);
                        }
                    }
                }
                else if (message.direction == 'incoming') {
                    if (message.cpim.headers['group-uuid']) {
                        let temp = this.state.previews.get(message.cpim.headers['group-uuid']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.state.previews.set(message.cpim.headers['group-uuid'], temp);
                    } else if (message.cpim.headers["Group-UUID"]) {
                        let temp = this.state.previews.get(message.cpim.headers['Group-UUID']);
                        temp.bodyPreview = "New MMS Message";
                        temp.timestamp = now;
                        this.state.previews.set(message.cpim.headers['Group-UUID'], temp);
                    }
                    else {
                        if (this.$route.query.number) {
                            let temp = this.state.previews.get(this.$route.query.number);
                            //console.log(this.state.previews.get(this.$route.query.number), " ", this.$route.query.number);
                            temp.bodyPreview = "New MMS Message";
                            temp.timestamp = now;
                            this.state.previews.set(this.$route.query.number, temp);
                        }
                    }
                }
            }
            else {
                if (message.from == this.ownNumber) {
                    //set this.state.previews.get(message.to)bodyPreview to message.body
                    if (this.state.previews.get(message.to)) {
                        let temp = this.state.previews.get(message.to);
                        temp.bodyPreview = message.body;
                        temp.timestamp = now.toString();
                        this.state.previews.set(message.to, temp);
                    }
                }
                else if (message.to == undefined) {
                    //set this.state.previews.get(message.from)bodyPreview to message.body
                    if (this.state.previews.get(message.from)) {
                        let temp = this.state.previews.get(message.from);
                        temp.bodyPreview = message.body;
                        temp.timestamp = now.toString();
                        this.state.previews.set(message.from, temp);
                    }
                }
            }
            this.$forceUpdate();
        }
    },
    watch: {
        threadPreviews: {
            handler(oldPreviews, newPreviews) {
            },
            deep: true,
        },
        smallScreen: {
            handler(oldScreen, newScreen) {
                let smallScreen = useMatchMedia('(max-width<=700px)');
                if (smallScreen) {
                    let pullToRefresh = document.querySelector('.pull-to-refresh');
                }
                else {
                    let pullToRefresh = false;
                }
            }
        }
    },
    async created() {
        loadPreviews(this.extensionUUID, state.oldestMessage);
    },
    mounted() {
        emitter.on('thread-change', (payload: ThreadChangePayload) => {
            this.contactEditLink = payload.editLink;
            this.threadUUID = payload.threadUUID;
            //console.log(`wtc thread change ${payload.threadUUID}`)
            this.title = payload.key;
            const updateUserLastSeenObject = { thread_uuid: payload.threadUUID, extension_uuid: this.$route.query.extension_uuid }
            emitter.emit("conversation-accessed", updateUserLastSeenObject)
            emitter.emit('thread-changed', payload.key);
        });
        emitter.on("new-message-ingested", (message: MessageData) => {
            //console.log(`Message: ${message.body}`);
            //console.log("time to fetch");
        });
        emitter.on("update-last-message", (message: MessageData) => {
            this.updateLastMessage(message);
        });
        emitter.on("thread-search-request", async (queryString: string) => {
            if (this.$route.query.extension_uuid) {
                this.loaded = false;
                this.loadedPreviews = false;
                await searchPreviews(queryString, this.$route.query.extension_uuid);
            }
            else {
                alert("No Extension detected. Reload the page")
            }
        });
        emitter.on("previews-built-and-loaded", () => {
            this.loadedPreviews = true;
            this.load = true;
        });
        emitter.on("backfill-previews-requested", () => {
            console.log("bpl")
            loadPreviews(this.extensionUUID, state.oldestMessage);
        });
        emitter.on("add-template", async (queryString: saveTemplateQuery) => {
            if (queryString.template_uuid) {
                queryString.template_uuid = null;
            }
            queryString.extension_uuid = this.extensionUUID;
            await saveTemplate(queryString);
        });
        emitter.on("edit-template", async (queryString: saveTemplateQuery) => {
            queryString.extension_uuid = this.extensionUUID;
            await saveTemplate(queryString);
        });
        emitter.on("load-templates", async (queryString: loadTemplateQuery) => {
            queryString.extension_uuid = this.extensionUUID;
            return await loadTemplates(queryString);
        });
        emitter.on("delete-template-request", async (args: deleteTemplateQuery) => {
            args.extension_uuid = this.extensionUUID;
            await deleteTemplate(args);
        });

        emitter.on("register-email-forwarding", async (args: registerForwardingRequest) => {
            args.extension_uuid = this.extensionUUID;
            await registerForwardAddress(args)
        });
        emitter.on("forwarded-email-check", async (args: checkForwardingRequest) => {
            //console.log("check if email already registered")
            args.extension_uuid = this.extensionUUID;
            await checkIfForwardedAddress(args);
        })
        emitter.on("forwarding-check-response", (args: ForwardingCheckResponseObject) => {
            this.$data.email = args.email;
            this.$data.emailVerified = args.emailVerified
            emitter.emit('returned-forwarding-check', args);
        })
        emitter.on("completed-email-forwarding-registration", (args: ForwardingCheckResponseObject) => {
            this.$data.email = args.email;
            if (args.email.length > 0) {
                this.$data.emailVerified = true;
                args.emailVerified = true;
            }
            else {
                this.$data.emailVerified = false;
                args.emailVerified = false;
            }
            emitter.emit("email-forwarding-register-success", args);
        })
    },
}
</script>

<!-- This container should default to threadlist on the left and blank space on the right.
The blank space should notify the user that they can select a thread to display that thread in the threadContainer -->
<template>
    <RouterView>

        <AlertFactory />
        <div id="WEB_TEXT_ROOT">
            <div v-if="smallScreen" class="pull-to-refresh">
                <div class="spinner-border"></div>
            </div>
            <RouterView name="leftSide" :ownNumber="this.$props.ownNumber" :threads="this.$props.threads"
                :threadPreviews="this.state.previews" :previewsLoaded="this.loadedPreviews"
                :selectedConvo="this.conversationSelected" :newThreadView="this.newThreadSelected"
                :extensionUUID="this.extensionUUID" :multipleWebTextingExtensions="this.multipleWebTextingExtensions" />


            <suspense>
                <RouterView name="rightSide" :extension_uuid="this.$route.query.extension_uuid"
                    :remoteNumber="this.$route.query.number" :groupUUID="this.$route.query.group"
                    :ownNumber="this.$props.ownNumber" :displayName="this.title"
                    :selectedConvo="this.conversationSelected" :contactEditLink="contactEditLink" :title="this.title"
                    :threadUUID="this.threadUUID" />
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

.bgc-AN-blue {
    background: #3178B1;
}

.bgc-none {
    background: none;
}

#TEST_DIV_FOR_TESTING_WEBTEXTING {
    /* height: 85vh; */
    background: none;
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
        z-index: -1;
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
        z-index: 1;
    }
}
</style>