<script lang='ts'>
//lets add a delete button and an edit button
import {emitter} from '../../lib/global';
type TemplatePreviewInterface = {
        link:{
            type:String,
            optional: true
        },
        template_uuid:{
            type: string,
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
        templateName:{
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
        templateName:{
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
    },
    //mounted click event emitter
}

</script>
<template>
        <tr class="align-middle">
            <th scope='col' class="align-middle">{{this.templateName}}</th>
            <th scope='col' class="align-middle">{{this.category }}</th>
            <th scope='col' class="align-middle">{{this.description}}</th>
            <th scope="col" class="align-items-center align-middle">
                <div class='m-auto'>
                    <router-link aria="Edit Template Button" :to="this.link" class="btn-primary p-2 btn rounded align-middle text-center"  @click="menuLinkClickHandler">
                        <span class="fa fa-cog"></span>
    
                    </router-link>    
                
                    <div aria="Delete Template Button" class="btn-danger btn p-2 rounded align-middle text-center " @click="deleteTemplateRequest">
                        <span class="fa fa-trash"></span>
                    </div>
                </div>
                
            </th>
        </tr>
    
</template>

<style scoped>
</style>