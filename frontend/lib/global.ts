import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';
import mitt from 'mitt';

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

export { state, emitter, MessageData }
