import { emitter } from './global';
import TemplateDropUpProps from '../components/TemplateDropUp/TemplateDropUpItem.vue';
type TemplateDropUpProps = typeof TemplateDropUpProps;
export type loadTemplateQuery = {
    extension_uuid: string
    older_than?: string
}

export type loadTemplateResponse = {
    domain_uuid: string;
    email_template_uuid: string;
    template_body: string;
    template_category: string;
    template_subcategory: string;
    template_language: string;
    template_subject: string;
    template_type: string;
    template_enabled: string;
    template_description: string;
    template_name: string;
    insert_date: string;
    insert_user: string;
    update_date: string;
    update_user: string;
};

let temp: Array<TemplateDropUpProps>;
let fetching = false;
export async function loadTemplates(args: loadTemplateQuery) {
    //console.log("[loadTemplates] Loading template Previews");
    if (fetching) {
        //console.log("[loadTemplates] Skipping duplicate load request");
        return;
    }
    fetching = true;
    emitter.emit("template-previews-loading");
    try {
        if (args) {
            //console.log(args);
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
                //g("No Message Templates found")
            }
        }
    } catch (e) {
        fetching = false;
        //console.log('[loadTemplates] Load template error:', e);
    } finally {

        emitter.emit('backfill-template-complete', temp);
        fetching = false;
        //console.log(temp)
        return (temp[0]);
    }
}