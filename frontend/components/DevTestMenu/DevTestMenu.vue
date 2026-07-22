<script lang="ts">
import { emitter, MessageData, state} from '../../lib/global'
import moment from "moment";
import PendingAttachment    from '../Sendbox/Sendbox.vue';
import { v4 as uuidv4 } from 'uuid';
import { CPIM } from "../../lib/CPIM";
import { uploadText } from "../../lib/upload";
import { getGroups, checkGroupsRequest } from "../../lib/getGroups";
import GroupDropDownItem, { GroupDropDownItemProps } from '../groupDropDown/GroupDropDownItem.vue';
import imgURL from '../../../anTestPNG.png'; 

type PendingAttachment = typeof PendingAttachment;
const MAXFILESIZE = 500000; //<---500KB in bytes
function verifyFileSize(file: File) {
  if (file.size < MAXFILESIZE) {
    return true;
  }
  return false;
}

export default {
    name: "DeveloperTestMenu",
    components: { GroupDropDownItem },
    props: {
        ownNumber: String,
        extension_uuid: String,
        location: String
    },

    data(): {
        testNumber: string;
        includeAttachment: boolean;
        pendingAttachments: PendingAttachment[];
        groups: GroupDropDownItemProps[];
        groupUUID: string;
    } {
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
                    body: moment(new Date()).toDate() + " Test Message from " + this.$props.ownNumber,
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
                return;
            }
            if (this.$data.testNumber.length <= 10) {
                console.log("Test number is too short, cannot send test message")
                return;
            }
            else {
                console.log("No activated number to send from")
                return;
            };
        },
        backArrowClickHandler() {
            emitter.emit('menu-change','test-menu');
        },
        async runTests() {
            console.log('running tests');
            let message = this.getTestSMSData();
            
            if (this.$data.includeAttachment) {
                //can use the AN brandmark at this location https://acceleratenetworks.com/images/scaled/accelerate.png
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
            console.log('emitting message', message);
            emitter.emit("outbound-message", message);
            //group messages are handled differently so we need to modify message before sending
            if (this.groupUUID) {
              const url = await uploadText(moment(new Date()).toDate() + " Group Test Message from " + this.$props.ownNumber);
              const cpim = new CPIM(url, "text/plain");
              cpim.bodyText = moment(new Date()).toDate() + " Group Test Message from " + this.$props.ownNumber;
              if (this.groupUUID) {
                cpim.headers["Group-UUID"] = this.groupUUID;
              }
              //console.log("outgoing cpim", cpim);
              message.contentType = "message/cpim";
              message.cpim = cpim;
              message.body = cpim.serialize();
            } else {
              message.contentType = "text/plain";
              message.body = moment(new Date()).toDate() + " Group Test Message from " + this.$props.ownNumber;
            }
            console.log('emitting message', message);
            emitter.emit("outbound-message", message);
        },
        numberPaste(e: ClipboardEvent) {
            //console.log(e);
        },
        getCPIMData(): (void) {
            //make a mock CPIM message data object to test CPIM sending
        },
        async fetchGroups() {            
            if (this.groups.length == 0) {
                const query: checkGroupsRequest = {
                    extension_uuid: this.$props.extension_uuid,
                };
                const fetchedGroups = await getGroups(query);
                console.log("Fetched group:", fetchedGroups);
                this.groups = fetchedGroups;
                document.getElementById("groupsdropdownmenu").classList.toggle("show");
            }
            else{
                document.getElementById("groupsdropdownmenu").classList.remove("show");
            }
        },        
        onAttach(e: Event) {
        //console.log(e.target.files);
            const target = e.target as HTMLInputElement;
            //console.log(target);
            for (const file of target.files) {
            if (verifyFileSize(file)) {
                const a: PendingAttachment = {
                file: file,
                previewURL: URL.createObjectURL(file),
                progress: 0,
                upload: null,
                uploadedURL: null,
                };
                a.upload = this.uploadAttachment(a);
                this.pendingAttachments.push(a);
            } else {
                alert(
                `The selected file is too large. We cannot send files bigger than ${
                    MAXFILESIZE / 1000
                }kB.`
                );
            }
            }
        },
        removeAttachment(attachment: PendingAttachment) {
        let position = this.pendingAttachments.indexOf(attachment);
        console.log("[Sendbox.removeAttachment] Removing attachment", position, attachment);
        this.pendingAttachments.splice(position, 1);
        },
        async uploadAttachment(attachment: PendingAttachment): Promise<void> {
        
            const uploadTarget = await fetch("upload.php", {
            method: "POST",
            body: JSON.stringify({ filename: attachment.file.name }),
            }).then((r) => r.json());

            attachment.uploadedURL = uploadTarget.download_url;

            console.log("[Sendbox.uploadAttachment] Uploading ", uploadTarget);
            console.log(uploadTarget.upload_url);
            const resp = await fetch(uploadTarget.upload_url, {
            method: "PUT",
            body: await attachment.file.arrayBuffer(),
            });
            attachment.progress = 100;

        },
        attachPendingAttachment(file: File) {
            if (verifyFileSize(file)) {
                const a: PendingAttachment = {
                file: file,
                previewURL: URL.createObjectURL(file),
                progress: 0,
                upload: null,
                uploadedURL: null,
                };
                a.upload = this.uploadAttachment(a);
                this.pendingAttachments.push(a);
            } else {
                //file size is set in SENDBOX.vue and imported for use here. Yes that's less than ideal
                alert(
                `The selected file is too large. We cannot send files bigger than ${
                    MAXFILESIZE / 1000
                }kB.`
                );
            }
        },  
    },
    async mounted() {
        console.log("mounted dev test menu");
        emitter.on('dev-menu-group-selection', (uuid: string) => {
            console.log("dev test menu real", uuid);
            this.groupUUID = uuid;
        });
        const testPNG:URL = new URL(imgURL)
        let blob = await fetch(testPNG).then(r => {
            return r.blob();
        });
        const file = new File([blob], "test.png", { type: "image/png" });
        this.attachPendingAttachment(file);

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
                <div class="form-group p-2 border rounded">
                    <h3 class="sms-test-input">SMS Test</h3>
                    <label for="dev-test-number" class='dev-test-message'>Enter Number:</label>
                        <input class='form-control form-control-lg' type="tel" size="11" min="10000000000" max="19999999999" @paste="numberPaste" v-model="testNumber" id="dev-test-number" name="dev-test-number" placeholder="12065551212" />
                        <label for="dev-test-number">Outbound Number must include Country Code and Area Code.</label>                        
                </div>             
                <div class="form-group p-2">
                    <input type="checkbox" class='mr-5' id="attachment_checkbox" name="attachment" v-model="includeAttachment"  />
                    <label for="attachment_checkbox">Include Attachment </label>
                </div>               
                <div class="form-group p-2 border rounded">
                    <h3 class="mms-test-input">MMS Test</h3>
                    <div class="btn-group align-middle dropdown p-2">
                        <div class="button-container">                             
                            <button
                                id="GROUP_DROPDOWN_BUTTON"
                                class="btn dropdown-toggle dropbtn"
                                data-toggle="group-dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                @click="fetchGroups"
                            >
                                <span class="dropbtn btn btn-primary" aria-hidden="true">Select a Group</span>
                            </button>
                            </div>
                            <div id="groupsdropdownmenu" class="group-dropdown dropdown dropdown-menu dropdown-group-select-menu" aria-labeledby="GROUP_DROPDOWN_BUTTON" aria-label="Group Selection Menu" role="menu">
                                <GroupDropDownItem
                                    v-for="group in this.groups"
                                        :name="group.name"
                                        :members="group.members"
                                        :group_uuid="group.group_uuid"
                                        :key="group.group_uuid"
                                />
                                <GroupDropDownItem
                                v-if="this.groups.length === 0"
                                name="No Groups Found"
                                members=""
                                group_uuid=""
                                :key="0" />
                        </div>
                    </div>
                </div>
                <div class="dev-test-menu d-flex justify-content-end">
                    <button class="btn btn-danger mb-1" @click="runTests">Run Tests</button>
                </div>
    </div>
</template>
<style lang="css">
/* DROPDOWN MENU */

.dropbtn {
  border: none;
  cursor: pointer;
}
.dropdown-group-select-menu {
  display: none;
  position: absolute;
  background-color: #f1f1f1cc;
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
.group-dropdown  {
    display: none;
}
.group-dropdown.show {
    display: block;
}
 .dropdown-content-item {
    display: none;
    color: black;
    padding: 12px 16px;
    text-decoration: none;  
 }
 .dropdown-content-item.show{
    display: block;
 }
.group-dropdown a:hover {
  background-color: #ddd;
}
.show {
  display: block;
}
</style>