import {createWebHistory, createRouter, RouterView, RouterViewProps, createWebHashHistory} from 'vue-router';
import WebTextingContainer  from '../components/WebTextingContainer/WebTextingContainer.vue';
import ThreadList from '@/components/ThreadList/ThreadList.vue';
import NewMessage from '@/components/NewMessage.vue';
import ConversationVue from '@/components/conversation/Conversation.vue';
import ConvoPlaceholderVue from '@/components/ConvoPlaceholder.vue';

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
            {
                path:'/createthread.php',
                components:{
                    leftSide: ThreadList,
                    rightSide: NewMessage,
                }
                    
            },
            
        ]
        }
    ]
})
