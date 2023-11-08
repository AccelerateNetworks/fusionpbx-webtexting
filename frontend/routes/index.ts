import {createWebHistory, createRouter, RouterView, RouterViewProps, createWebHashHistory} from 'vue-router';
import WebTextingContainer  from '../components/WebTextingContainer/WebTextingContainer.vue';
import ThreadList from '@/components/ThreadList/ThreadList.vue';
import ConvoPlaceholderVue from '@/components/ConvoPlaceholder.vue';
import ConversationVue from '@/components/conversation/Conversation.vue';

export const router = createRouter({
    history: createWebHistory("/app/webtexting/"),
    routes:[
        {
            path:"/",
            component:WebTextingContainer,
            children:[
                {
                path:"/threadlist.php",
                components:{
                    leftSide: ThreadList,
                    rightSide: ConvoPlaceholderVue,
                },
            },
            {
                path:'/thread.php',
                
                components:{
                    leftSide: ThreadList,
                    rightSide: ConversationVue
                }
            },
            
        ]
        }
    ]
})
export default {}