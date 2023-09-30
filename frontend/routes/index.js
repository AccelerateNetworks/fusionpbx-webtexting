
import {createWebHistory, createRouter} from 'vue-router';


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path:'/',
            name:'Home',
            component: Vue.component('Home', require('../components/WebTextingContainer/WebTextingContainer.vue'))

        }
    ]
})

export default router;