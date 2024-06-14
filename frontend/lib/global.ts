import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';
import mitt from 'mitt';
import { ThreadPreviewInterface } from '../components/ThreadPreview/ThreadPreview.vue';

type ConversationData = Record<string,Array<MessageData>>;
type PreviewData = Map<String, ThreadPreviewInterface>;
type ThreadChangePayload = {
  key: String, 

  editLink?:  string,
  threadUUID?: string
  
};

type MessageData = {
    direction: string;
    contentType: string;
    timestamp: Moment;
    id?: string;
    from: string;
    to: string;
    body?: string;
    cpim?: CPIM;
}
//what do we do when we need to add a thread to threadlist
type GlobalState = {
    conversations: ConversationData,
    connectivityStatus: String,
    connected: Boolean,
    previews: PreviewData,
    page: number,
    oldestMessage: Number,
};
const QUERY_LIMIT = 20;  //this limits the nubmer of threadpreview results per load request

const state = reactive<GlobalState>({
    conversations:  {},
    connectivityStatus: 'loading',
    connected: false,
    previews: null,
    page:0,
    oldestMessage: null
});

const emitter = mitt();

function addMessage(key:string, message: MessageData) {
    console.log("trying to add message with key: " + key);
    console.log(message)
    emitter.emit("update-last-message",message)

    if(state.conversations[key]){
        //console.log("conversation found checking messages");
        //console.log(state.conversations[key])
        if (message.id ) {
            let messages = state.conversations[key];
            if(messages){
                for(let m of messages) {
                    if (m.id == message.id) {
                        console.log("not re-inserting message", message.id);
                        return;
                    }
                }
                console.log("inserting new message", message.id);
            }
            
        } else {
            console.log("adding message with no ID!", message);       
        }
        emitter.emit('scroll-to-bottom'); 
        emitter.emit('new-message-ingested',message);
        // console.log(`key: ${key}`);
        // console.log(`state.conversations[key:${state.conversations[key]}`);
        state.conversations[key].push(message);
    }
    else{
        console.log("conversation not found adding conversation")
        addThread(key,message);
    }
    
}

function addThread(key:string, message?:MessageData){
    //console.log(state.conversations)
    if(message){
        if(!message.id){
            message.id = message.message_uuid;
        }
        const newConversation = Array<MessageData>(message);
        console.log(`new messages to add to new conversation ${newConversation}`);
        state.conversations[key] = newConversation;
        console.log(`adding conversation with message ${message}`)
    }
    else{
        state.conversations[key] = new Array<MessageData>();
        console.log(`adding conversation without message`)
    }
}
function addPreview(preview : ThreadPreviewInterface){
    //console.log(preview)
    const conversationKey:string = preview.groupUUID ? preview.groupUUID : preview.remoteNumber;
    if(state.previews){
        if(previewsContainKey(conversationKey)){
            //don't add duplicates
        }
        else{
            console.log(Date.parse(preview.timestamp))
            updateOldestMessage(Date.parse(preview.timestamp));
            state.previews.set(conversationKey,preview);
        }
    }
    else{   //first add also creates the map
        state.previews = new Map<String,  ThreadPreviewInterface>();
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
function updateOldestMessage(newOldestTimestamp: Number){
    if(state.oldestMessage){
        if(newOldestTimestamp < state.oldestMessage){
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
export { state, emitter, QUERY_LIMIT, MessageData, GlobalState, ThreadChangePayload, addMessage, addPreview, updatePageNumber  }
