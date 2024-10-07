import { emitter } from './global';

export type deleteTemplateQuery = {
    template_uuid: String,
    extension_uuid?:String
}
let temp;
let fetching = false;


export async function deleteTemplate(args:deleteTemplateQuery) {
    console.log("deleting template");
    if (fetching) {
        console.log("skipping duplicate delete request");
        return;
    }
    fetching = true;
    emitter.emit("delete-template-pending");
    try {
        // console.log(args);
        if(args){
            console.log(args);
            let params: deleteTemplateQuery;
            if (args.template_uuid) {
              params = { template_uuid: args.template_uuid };
            }
            if(args.extension_uuid){
                params.extension_uuid = args.extension_uuid;
            }
            const initialResponse =  await fetch('/app/webtexting/deletetemplate.php?' + new URLSearchParams(params).toString()).then(r => r.json());
            temp = initialResponse;
            console.log(temp);
    
            fetching = false;
            //console.log('backfillPreviews request complete');
    
            // if (initialResponse.length == 0) {
            //     emitter.emit('no-previews-found');
            // }
            
        }
        

    } catch (e) {
        fetching = false;
        console.log('delete template error:', e);
    }finally{
        
        emitter.emit('delete-template-complete',temp);
        fetching= false;
        console.log(temp)
        return  ( temp);
    }

}