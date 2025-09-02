import { emitter } from './global';
import TemplateDropUpProps from '../components/TemplateDropUp/TemplateDropUpItem.vue';
type TemplateDropUpProps = typeof TemplateDropUpProps;
export type loadTemplateQuery = {
    extension_uuid: String
    older_than?: String
}

export type loadTemplateResponse = {
    domain_uuid: String;
    email_template_uuid: String;
    template_body: String;
    template_category: String;
    template_subcategory: String;
    template_language: String;
    template_subject: String;
    template_type: String;
    template_enabled: String;
    template_description: String;
    template_name: String;
    insert_date: String;
    insert_user: String;
    update_date: String;
    update_user: String;
};

let temp: Array<TemplateDropUpProps>;
let fetching = false;
export async function loadTemplates(args: loadTemplateQuery) {
    console.log("[loadTemplates] Loading template Previews");
    if (fetching) {
        console.log("[loadTemplates] Skipping duplicate load request");
        return;
    }
    fetching = true;
    emitter.emit("template-previews-loading");
    try {
        if (args) {
            console.log(args);
            let params: loadTemplateQuery;
            if (args.extension_uuid) {
                params = { extension_uuid: args.extension_uuid };
            }
            if (args.older_than) {
                params.older_than = args.older_than;
            }
            const initialResponse = await fetch('/app/webtexting/loadtemplates.php?' + new URLSearchParams(params).toString()).then(r => r.json());
            temp = initialResponse;

            fetching = false;
            //console.log('backfillPreviews request complete');

            if (temp.length == 0) {
                emitter.emit('no-templates-found');
                console.log("No Message Templates found")
            }
        }
    } catch (e) {
        fetching = false;
        console.log('[loadTemplates] Load template error:', e);
    } finally {

        emitter.emit('backfill-template-complete', temp);
        fetching = false;
        console.log(temp)
        return (temp[0]);
    }
}