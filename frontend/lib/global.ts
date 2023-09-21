import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';
import mitt from 'mitt';

type ConversationData = {
    messages: MessageData[];
}

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

type GlobalState = {
    messages: MessageData[],
    connectivityStatus: String,
    connected: Boolean,
};

const state = reactive<GlobalState>({
    messages: [],
    connectivityStatus: 'loading',
    connected: false,
});

const emitter = mitt();

function addMessage(message: MessageData) {
    if (message.id) {
        for(let m of state.messages) {
            if (m.id == message.id) {
                console.log("not re-inserting message", message.id);
                return;
            }
        }
        console.log("inserting new message", message.id);
    } else {
        console.log("adding message with no ID!", message);
    }

    state.messages.push(message);
    emitter.emit('scroll-to-bottom');
}

export { state, emitter, MessageData, GlobalState, addMessage }
