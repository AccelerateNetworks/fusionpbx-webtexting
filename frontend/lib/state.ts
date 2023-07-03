import { Moment } from 'moment';
import { reactive } from 'vue'
import { CPIM } from './CPIM';

type MessageData = {
    direction: string;
    contentType: string;
    timestamp: Moment;
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

export { state, MessageData }
