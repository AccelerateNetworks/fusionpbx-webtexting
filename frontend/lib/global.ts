import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';
import mitt from 'mitt';
import {v4 as uuidv4} from 'uuid';

type ConversationData = Record<string,Array<MessageData>>;
type ThreadChangePayload = {
  key: string, 
  editLink?:  string,
  threadUUID?: string
  
};
type MenuChangePayload = {
    name: string
}

type MessageData = {
    direction: string;
    contentType: string;
    timestamp: Moment;    
    from: string;
    to: string;
    id?: string;
    body?: string;
    cpim?: CPIM;
    extensionUUID?: string;
    delivered?: boolean;
    from_host?: string;
    statusText?: string;
    key?: string;
}
type MessageSuccessPayload={
ReasonPhrase: string;
authToken:string;
id: string;
key: string;
sourceURL: string;
statusCode: number;
timestamp: string;

}

type ThreadPreviewData = {
    displayName: string,
    bodyPreview:  string,
    link: string,
    timestamp:string,
    remoteNumber: string,
    groupUUID?: string,
    ownNumber: string,
    contactEditLink?: string,
    groupMembers?: Array<string>,
    threadUUID?: string,
}
type ThreadPreviewConstructorArgs ={
    displayName: string
                bodyPreview: string,
                link: string,
                timestamp: string,
                remoteNumber: string,
                ownNumber: string,   
}
//what do we do when we need to add a thread to threadlist
type GlobalState = {
    conversations: ConversationData,
    connectivityStatus: string,
    connected: Boolean,
    previews: PreviewData,
    page: number,
    oldestMessage: string,
};
const QUERY_LIMIT = 20;  //this limits the number of threadpreview results per load request
type PreviewData = Map<string, ThreadPreviewData>;


const state = reactive<GlobalState>({
    conversations:  {},
    connectivityStatus: 'loading',
    connected: false,
    previews: new Map<string,  ThreadPreviewData>(),
    page:0,
    oldestMessage: null
});

const emitter = mitt();
// add handling for 'do not add' fail case key from SIP.ts
function  updateMessageStatus(key:string, id: string, status: boolean):MessageSuccessPayload {
    console.log("trying to update message with key: " + key + " to status: " + status);
    if(state.conversations[key]){
        let messages = state.conversations[key];
        if(messages){
            for(let m of messages) {
                //console.log("checking message id: " + m.id)
                if (m.id == id) {
                    //console.log("updating message", id);
                    m.delivered = status;
                    return;
                }
            }
        }
    }
    else{
        console.log("[Global.updateMessageStatus] Conversation not found, cannot update message status")
    }
}
function addMessage(key:string, message: MessageData) {
    //console.log("trying to add message with key: " + key);
    //console.log(message)
    emitter.emit("update-last-message",message)

    if(state.conversations[key]){
        //console.log("conversation found checking messages");
        //console.log(state.conversations[key])
        if (message.id ) {
            let messages = state.conversations[key];
            if(messages){
                for(let m of messages) {
                    //console.log("checking message id: " + m.id);
                    if (m.id == message.id) {
                        //console.log("not re-inserting message", message.id);
                        return;
                    }
                }
                //console.log("inserting new message", message.id);
            }
        } else {
            //console.log("adding message with no ID!", message);       
        }
        emitter.emit('scroll-to-bottom'); 
        emitter.emit('new-message-ingested',message);
        // console.log(`key: ${key}`);
        // console.log(`state.conversations[key:${state.conversations[key]}`);
        state.conversations[key].push(message);
    }
    else{
        //console.log("[Global.addMessage] Conversation not found adding conversation")
        addThread(key,message);
    }
}

function addThread(key:string, message?:MessageData){
    console.log(state.conversations)
    if(message){
        //if a message doesn't have message.id we have to make one
        if(!message.id){
            message.id = uuidv4();
            console.log(`[Global.addThread] Message had no ID, assigned new UUID: ${message.id}`);
        }
        //console.log(message);
        const newConversation = Array<MessageData>(message);
        //console.log(`[Global.addThread] New messages to add to new conversation ${newConversation}`);
        state.conversations[key] = newConversation;
        //console.log(`[Global.addThread] Adding conversation with message ${message}`)

        //this is where we add a ThreadPreview for a new outgoing message
        //TODO: refactor to allow MMS messages on new message
        if(message.direction==='outgoing' && message.extensionUUID){
            const newConversationLink: string=`thread.php?extension_uuid=${message.extensionUUID}&number=${message.to}`;
            const newOutgoingPreview: ThreadPreviewConstructorArgs = {
                displayName: message.to,
                bodyPreview: message.body,
                link: newConversationLink,
                timestamp: message.timestamp.toISOString(true),
                remoteNumber: message.to,
                ownNumber: message.from,        

            }
            addTempPreview(newOutgoingPreview);
        }
        //new inbound messages have no message.to somehow
        else if(message.direction==='incoming' && !message.to){
            const newConversationLink: string=`thread.php?extension_uuid=${message.extensionUUID}&number=${message.from}`;
            const newIncomingPreview: ThreadPreviewConstructorArgs = {
                displayName: message.from,
                bodyPreview: message.body,
                link: newConversationLink,
                timestamp: message.timestamp.toISOString(true),
                remoteNumber: message.from,
                ownNumber: message.to,        
            }
            addTempPreview(newIncomingPreview);
        }        
    }
    else{
        state.conversations[key] = new Array<MessageData>();
        //console.log(`adding conversation without message`)
    }
}
function addPreview(preview : ThreadPreviewData){
    //console.log(preview)
    const conversationKey:string = preview.groupUUID ? preview.groupUUID : preview.remoteNumber;
    if(state.previews){
        if(previewsContainKey(conversationKey)){
            //Don't add duplicates.
            console.log('conversation already exists in state.previews, updating entry for: ', conversationKey);
            updateOldestMessage(preview.timestamp);
            state.previews.set(conversationKey,preview);
        }
        else{
            //console.log(Date.parse(preview.timestamp))
            updateOldestMessage(preview.timestamp);
            state.previews.set(conversationKey,preview);
        }
    }
    else{   //first add also creates the map
        state.previews = new Map<string,  ThreadPreviewData>();
        state.previews.set(conversationKey, preview);
    }
}
//this is for adding Thread Previews fro threads that are generated while the user is active on the webtexting client
function addTempPreview(preview : ThreadPreviewConstructorArgs){
    //console.log(preview)
    const conversationKey:string = preview.remoteNumber;
    if(state.previews){
        if(previewsContainKey(conversationKey)){
            //Don't add duplicates.
        }
        else{
            //console.log(Date.parse(preview.timestamp))
            updateOldestMessage(preview.timestamp);
            state.previews.set(conversationKey,preview);
        }
    }
    else{   //first add also creates the map
        state.previews = new Map<string,  ThreadPreviewData>();
        state.previews.set(conversationKey, preview);
    }
}
function previewsContainKey(keyQuery:string){
    return state.previews.has(keyQuery);
}
//input: key for ThreadPreview that needs updating
//input: timestamp to update ThreadPreview with
function updatePreviewTimestamp(previewKey: string){
    //update the timestamp of the preview who's key matches previewKey
}

function updatePageNumber(){
    state.page = state.page+1;
    return state.page;
}
function updateOldestMessage(newOldestTimestamp: string){
    if(state.oldestMessage){
        //cast to numbers for this comparison
        if(Date.parse(newOldestTimestamp) < Date.parse(state.oldestMessage)){
            state.oldestMessage = newOldestTimestamp;
        }
    }
    else{
        state.oldestMessage = newOldestTimestamp;
    }
    //console.log(newOldestTimestamp)
    //console.log(state.oldestMessage)
    return state.oldestMessage;
}
export { state, emitter, QUERY_LIMIT, MessageData, GlobalState, ThreadChangePayload, MenuChangePayload, addMessage, addPreview, updatePageNumber, ThreadPreviewData, updateMessageStatus,MessageSuccessPayload  }
