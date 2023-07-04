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

const state = reactive<{
    messages: MessageData[],
    connectivityStatus: String,
}>({
    messages: [],
    connectivityStatus: 'loading',
});

const emitter = mitt();

export { state, emitter, MessageData }
