<script lang="ts">
import { emitter } from '../../lib/global';
import { loadTemplateResponse } from '../../lib/loadTemplates';
import TemplatePreview, { TemplatePreviewInterface } from '../TemplatePreview/TemplatePreview.vue';
export default {
  components: { TemplatePreview },
    name: 'TemplatesMenu',
    emits: {
        'leave-menu': String
    },
    methods: {
        backArrowClickHandler() {
            emitter.emit('menu-change');
        },
        requestTemplateSave(event){
            event.preventDefault();
            //console.log(this.formInputs)

            emitter.emit('edit-template',this.formInputs)
        },
        buildTemplatePreview(values: loadTemplateResponse){
            console.log(values);
            let tempPreview:TemplatePreviewInterface = {
                link: '/manage_templates.php?'+ new URLSearchParams(values).toString(),
                template_uuid : values.email_template_uuid,
                body : values.template_body,
                category : values.template_category,
                subcategory : values.template_subcategory,
                language : values.template_language,
                subject : values.template_subject,
                templateType : values.template_type,
                enabled : values.template_enabled,
                description : values.template_description,
            }
            console.log(tempPreview)
                
            return tempPreview
        }
    },
    data(){
        return {
            templatesLoaded: false,
            templatePreviews: [],
        }
    },
    mounted() {
        emitter.emit("load-templates",{});
        emitter.on("backfill-template-complete",(results:Array<loadTemplateResponse>) =>{
            console.log("backfilled templates");
            console.log(results);
            let typedTemplatesArray= new Array<TemplatePreviewInterface>;
            for( let x = 0 ; x < results.length ; x++){
                console.log(results[x]);
                let entry: TemplatePreviewInterface = this.buildTemplatePreview(results[x]);
                
                console.log(entry);
                typedTemplatesArray.push(entry);
            }
            this.templatesLoaded = true;
            this.templatePreviews = typedTemplatesArray;
        });
        
    },
    


}
</script>
<template>
    <div id="TEMPLATES_MENU">
        <div class="templates-container">
            <div class="thread-header new-message-header">
                <div class="thread-header-container  d-flex justify-content-between align-items-center">
                    <div class="'ml-05">
                        <router-link class="fa fa-arrow-left btn btn-large " :to="`/menu.php`"
                            @click="backArrowClickHandler" aria="Go Back to Settings Menu"></router-link>

                        <div class="new-message-headline">
                            <h6>Templates</h6>
                        </div>

                    </div>
                </div>
            </div>
            <!-- This is where the list of templates should load -->
            <!-- That means we need a TemplateEntry component w/ a link to edit -->

            <!-- template-form should probably be a component as well -->
            <!-- for now we need to make sure the app -> db connection works so we'll hard code -->

            <div class="templates-list overflow-scroll">
                <router-link to="/manage_templates.php">Add New Template</router-link>
                <div class="conditional_container table-responsive overflow-scroll" v-if="this.templatesLoaded" ref="conditional_container" >
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope='col'>Type</th>
                                <th scope='col'>Description</th>
                                <th scope='col'>Edit Template</th>
                                <th scope='col'>Delete Template</th>
                            </tr>
                        </thead> 
                        <tbody class="overflow-scroll">
                            <TemplatePreview  v-for="item in this.templatePreviews" :key="item.template_uuid" v-bind="item"></TemplatePreview>
                        </tbody>
                    </table>
                </div>
                <div class="load-animation-container" v-else>
                    <img src="../../../loading-spinner.svg" alt="loading animation" width="150" height="150"/>
                </div>
            </div>

            
 
        </div>
    </div>
</template>

<style scoped>
#TEMPLATES_MENU{
    height:85vh;
    overflow-y: scroll;
}
.template-form{
    width: 90%;
    margin: auto;
    align-content: center ;
    justify-content: center;
}
.mt-form-row {
    display: grid;
    grid-template-columns: 20% 80%;
}
.area-for-text{
    grid-column: 2;
}
.category-desc{
    grid-column:1;
    margin-left: 0px;
}
.mandatory{
    font-weight: bolder;
}

@media screen and (width <=700px) {
    .template-form{
        width:95%;
    }
    #THREAD {
        z-index: 5;
        grid-column-start: 1;
        grid-column-end: 1;
        height: 91vh;
    }

    .thread-container {
        height: 90vh;
    }

    .messages {
        height: 80vh;
    }

}
</style>