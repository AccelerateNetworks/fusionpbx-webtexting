<script lang='ts'>
//lets add a delete button and an edit button
import {emitter} from '../../lib/global';
export type TemplatePreviewInterface = {
        link:{
            type:String,
            optional: true
        },
        template_uuid:{
            type: String,
            optional: true
        },
        body:{
            type: String
        },
        category:{
            type: String
        },
        subcategory:{
            type: String
        },
        language:{
            type: String
        },
        subject:{
            type: String,
        },
        templateType:{
            type: String
        },
        enabled:{
            type: String
        },
        description: {
            type: String
        },
    
}

export default {
    name:'TemplatePreview',
    props:{
        link:{
            type:String,
            optional: true
        },
        template_uuid:{
            type: String,
            optional: true
        },
        body:{
            type: String
        },
        category:{
            type: String
        },
        subcategory:{
            type: String
        },
        language:{
            type: String
        },
        subject:{
            type: String,
        },
        templateType:{
            type: String
        },
        enabled:{
            type: String
        },
        description: {
            type: String
        },
    },
    methods:{
        menuLinkClickHandler(){
            console.log(this.description)
            emitter.emit("template-change",this.props)
        },
        deleteTemplateRequest(){
            emitter.emit("delete-template-request",{template_uuid: this.template_uuid})
        }
    },
    mounted(){
        console.log(this.link);
    },
    //mounted click event emitter
}

</script>
<template>
        <tr>
            <th scope='col' >{{this.category }}</th>
            <th scope='col' >
                {{this.description }}
            </th>
            <th scope="col">
                <router-link :to="this.link" class="template-preview-link" v-bind="this.props" @click="menuLinkClickHandler">
                    Edit Template
                </router-link>    
            </th>
            <td scope="col" class="align-middle text-center" >
                <div class="btn-danger p-2 rounded align-middle text-center" @click="deleteTemplateRequest">
                    <span>Delete</span>
                </div>
            </td>
        </tr>
    
</template>

<style scoped>
</style>