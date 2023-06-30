import { Moment } from 'moment';
import { reactive } from 'vue'

type MessageData = {
    direction: string;
    contentType: string;
    timestamp: Moment;
    from: string;
    to: string;
    body: string;
}

const state = reactive<{
    messages: MessageData[],
    connectivityStatus: String,
}>({
    messages: [],
    connectivityStatus: 'loading',
});

export { state, MessageData }
