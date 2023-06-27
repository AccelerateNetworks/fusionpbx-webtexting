import Conversation from './components/Conversation.vue';
import { createApp } from 'vue'

function mountConversation(querySelector: String) {
    createApp(Conversation).mount(querySelector);
}

export { mountConversation };
