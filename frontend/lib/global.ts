import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';
import mitt from 'mitt';
import { ThreadPreviewInterface } from '@/components/ThreadPreview/ThreadPreview.vue';

type ConversationData = Record<string,Array<MessageData>>;
type PreviewData = Map<String, ThreadPreviewInterface>;
type ThreadChangePayload = {
  key: String, 

  editLink?:  string;
  
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
    previews: PreviewData
};

const state = reactive<GlobalState>({
    conversations:  {},
    connectivityStatus: 'loading',
    connected: false,
    previews: null,
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
    const conversationKey:String = preview.groupUUID ? preview.groupUUID : preview.remoteNumber;
    if(state.previews){
        if(previewsContainKey(conversationKey)){
            //don't add duplicates
        }
        else{
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
export { state, emitter, MessageData, GlobalState, addMessage, ThreadChangePayload, addPreview }
