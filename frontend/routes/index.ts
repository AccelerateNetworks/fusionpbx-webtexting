import {createWebHistory, createRouter, RouterView, RouterViewProps, createWebHashHistory} from 'vue-router';
import WebTextingContainer  from '../components/WebTextingContainer/WebTextingContainer.vue';
import ThreadList from '@/components/ThreadList/ThreadList.vue';
import NewMessage from '@/components/NewMessage.vue';
import ConversationVue from '@/components/conversation/Conversation.vue';
import ConvoPlaceholderVue from '@/components/ConvoPlaceholder.vue';
import MenuPlaceHolder from '@/components/MenuPlaceholder/MenuPlaceholder.vue';
import MenuList from '../components/MenuList/MenuList.vue';
import TemplatesMenu from '@/components/TemplatesMenu/TemplatesMenu.vue';
import TemplatesForm from '@/components/TemplatesForm/TemplatesForm.vue';
import EmailForwardMenu from '@/components/EmailForwardMenu/EmailForwardMenu.vue';

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
            {
                path:'/menu.php',
                components:{
                    leftSide: MenuList,
                    rightSide: MenuPlaceHolder,
                }
            },
            {
                path:"/templates.php",
                components:{
                    leftSide:MenuList,
                    rightSide: TemplatesMenu,
                }
            },
            {
                path:"/manage_templates.php",
                components:{
                    leftSide:MenuList,
                    rightSide: TemplatesForm,
                }
            },
            {
                path:"/email_forwarding.php",
                components:{
                    leftSide:MenuList,
                    rightSide:EmailForwardMenu
                }
            },
            
        ]
        }
    ]
})
