<script lang="ts">
import { emitter, MessageData } from '../../lib/global'
import moment from "moment";
import PendingAttachment, { attachPendingAttachment,uploadAttachment, }   from '../Sendbox/Sendbox.vue';
import { v4 as uuidv4 } from 'uuid';
import { CPIM } from "../../lib/CPIM";
import { getGroups, checkGroupsRequest } from "../../lib/getGroups";
import GroupDropDownItem, { GroupDropDownItemProps } from '../groupDropDown/GroupDropDownItem.vue';
type PendingAttachment = typeof PendingAttachment;

export default {
    name: "DeveloperTestMenu",
    components: {GroupDropDownItem},
    props: {
        ownNumber:String,
        extension_uuid: String
    },

    data(): {
        testNumber: string;
        includeAttachment: boolean;
        pendingAttachments: PendingAttachment[];
        groups: GroupDropDownItemProps[];
        groupUUID: string;
    }
    {
        return {
            testNumber: '',
            includeAttachment: false,
            pendingAttachments: [],
            groups: [],
            groupUUID: ''
        }
    },
    methods: {
        getTestSMSData(): (MessageData) {
            if (this.$props.ownNumber) {
                return {
                    body:moment(new Date()).toDate() + " Test Message from " + this.$props.ownNumber , 
                    direction: "outgoing",
                    contentType: "text/plain",
                    timestamp: moment(new Date()),
                    id: uuidv4(),
                    from: this.$props.ownNumber,
                    to: this.$data.testNumber 
                }
            }
            if (this.$props.ownNumber === '') {
                console.log("Own number prop is empty string, cannot send test message")
                return ;
            }
            if(this.$data.testNumber.length<=10){
                console.log("Test number is too short, cannot send test message")
                return ;
            }
            else {
                console.log("No activated number to send from")
                return ;
            };           
        },
        backArrowClickHandler() {
            emitter.emit('menu-change');
        },
        async runTests() {
            console.log('running tests');
            const message = this.getTestSMSData();
            if (this.$data.includeAttachment) {
                //do attachment
                while (this.pendingAttachments.length > 0) {
                    const attachment = this.pendingAttachments.shift();
                    await attachment.upload;
                    const cpim = new CPIM(attachment.uploadedURL, attachment.file.type);
                    // not doing group testing yet, we would add the group UUID to the CPIM headers here
                    if (this.groupUUID) {
                        cpim.headers["Group-UUID"] = this.groupUUID;
                    }
                    cpim.previewURL = attachment.previewURL;
                    message.cpim = cpim;
                }
            }
            emitter.emit("outbound-message",message)
        },
        numberPaste(e: ClipboardEvent) {
            //console.log(e);
        },
        getCPIMData(): (void) {
            //make a mock CPIM message data object to test CPIM sending
        },
        async mounted() {
            console.log("mounted dev test menu");
            emitter.on('group-dropup-selection-recieved', (uuid:string) => {
                console.log("group-dropup-selection-recieved event received in dev test menu", uuid);
            });             
        },
        async fetchGroups() {
            document.getElementById("groupsdropdownmenu").classList.toggle("show");
            const query: checkGroupsRequest = {
                extension_uuid: this.$props.extension_uuid,
            };
            const fetchedGroups = await getGroups(query);
            console.log("Fetched group:", fetchedGroups);
            this.groups = fetchedGroups;            
        }
    }
}
</script>
<template>
    <div id="TEST_MENU">
        <div class="thread-header new-message-header">
                    <div class="thread-header-container  d-flex justify-content-between align-middle align-items-center">
                        <div class="row align-items-center align-middle">
                            <router-link class="fa fa-arrow-left btn btn-large align-middle" :to="`/menu.php`"
                                @click="backArrowClickHandler" aria="Go Back to Settings Menu"></router-link>    
                            <div>
                                <h6 class="mb-0">Developer Menu</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group pt-1">
                    <h3 class="sms-test-input">SMS Test</h3>
                    <label for="dev-test-number" class='dev-test-message'>Enter Number:</label>
                        <input class='form-control form-control-lg' type="tel" size="11" min="10000000000" max="19999999999" @paste="numberPaste" v-model="testNumber" id="dev-test-number" name="dev-test-number" placeholder="12065551212" />
                        <label for="dev-test-number">Outbound Number must include Country Code and Area Code.</label>                        
                </div>             
                <div class="form-group pt-1">
                    <input type="checkbox" class='mr-5' id="attachment_checkbox" name="attachment" v-model="includeAttachment"  />
                    <label for="attachment_checkbox">Include Attachment </label>
                </div>               
                <div class="form-group pt-1">
                    <h3 class="mms-test-input">MMS Test</h3>
                    <div>In Development!</div>
                    <button
                        class="btn dropdown-toggle dropbtn"
                        data-toggle="group-dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        @click="fetchGroups"
                    >
                        <span class="dropbtn fas fa-comment-dots" aria-hidden="true"></span>
                    </button>
                    <div class="group-dropdown dropdown" aria-labelledby="group-dropdown">
                        <div id="groupsdropdownmenu" class="dropdown-group-select-menu">
                            <GroupDropDownItem
                            v-for="group in this.groups"
                                :name="group.name"
                                :members="group.members"
                                :group_uuid="group.group_uuid"
                                :key="group.group_uuid"
                            />
                        </div>
                    </div>
                </div>
                <div class="dev-test-menu">
                        <button class="btn btn-danger mb-1" @click="runTests">Run Tests</button>
                </div>
    </div>
</template>
<style scoped>
/* DROPDOWN MENU */

.dropbtn {
  /*
    background-color: #3498DB;
    color: white;
    */
  border: none;
  cursor: pointer;
}
/*
.group-dropdown {
  /*position: relative; 
    display: inline-block;
} 
*/
.dropdown-group-select-menu {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-group-select-menu a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.group-dropdown a:hover {
  background-color: #ddd;
}

.show {
  display: block;
}
</style>