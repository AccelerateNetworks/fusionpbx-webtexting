<script lang="ts">
import { emitter } from '../../lib/global';

export default {
    name: 'TemplatesForm',
    props:{
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
        }
    },
    data(){
        return {
            formInputs:{
                template_uuid:this.$route.query.email_template_uuid,
                language: this.$route.query.template_language,
                category:this.$route.query.template_category,
                subcategory:this.$route.query.template_subcategory,
                subject:this.$route.query.template_subject,
                body:this.$route.query.template_body,
                templateType:this.$route.query.template_templateType,
                enabled:this.$route.query.template_enabled,
                description:this.$route.query.template_description,
            }
        }
    },
    created(){

    },
    


}
</script>
<template>
    <div id="TEMPLATES_MENU">
        <div class="templates-container">
            <div class="thread-header new-message-header">
                <div class="thread-header-container  d-flex justify-content-between align-items-center">
                    <div class="'ml-05">
                        <router-link class="fa fa-arrow-left btn btn-large " :to="`/templates.php`"
                            @click="backArrowClickHandler" aria="Go Back to Templates Menu"></router-link>

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

            <div class="template-form ">
                <div class="mt-form-row">
                    <div class="category-template-uuid">Template UUID</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.template_uuid"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Language</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.language"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc mandatory">Category</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.category"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Subcategory</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.subcategory"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Subject</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.subject"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc mandatory">Body</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.body"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Type</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.templateType"></textarea></div>

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Enabled</div>
                    <input type="checkbox" id="ENABLED_CHECKBOX" v-model="formInputs.enabled" />
                    <label for="ENABLED_CHECKBOX">{{ formInputs.enabled }}</label> 

                </div>
                <div class="mt-form-row">
                    <div class="category-desc">Description</div>
                    <div class="area-for-text"> <textarea v-model="formInputs.description"></textarea></div>
                </div>
                <button class="submit" @click="requestTemplateSave">Submit</button>

            </div>
 
        </div>
    </div>
</template>

<style scoped>

</style>