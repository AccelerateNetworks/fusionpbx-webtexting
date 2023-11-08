import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';
import mitt from 'mitt';

type ConversationData = Record<string,Array<MessageData>>;

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
};

const state = reactive<GlobalState>({
    conversations:  {},
    connectivityStatus: 'loading',
    connected: false,
});

const emitter = mitt();

//reconfiguring to work with messages as a record of keys / adding message IDs
function addMessage(key:string, message: MessageData) {
    //console.log("trying to add message");
    
    if(state.conversations[key]){
        //console.log("conversation found checking messages");
        //console.log(state.conversations[key])
        if (message.id ) {
            //message.id = message.message_uuid;
            let messages = state.conversations[key];
            //console.log(`this.messages ${messages}`);
            if(messages){
                for(let m of messages) {
                    if (m.id == message.id) {
                        //console.log("not re-inserting message", message.id);
                        return;
                    }
                }
                //console.log("inserting new message", message.id);
            }
            
        } else {
           // console.log("adding message with no ID!", message);       
        }
        emitter.emit('scroll-to-bottom'); 
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
        console.log(`ading conversation without message`)
    }
}

export { state, emitter, MessageData, GlobalState, addMessage }
