import { emit } from 'process';
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
    if(args){
        let params: deleteTemplateQuery;
        if (args.template_uuid) {
          params = { template_uuid:''};
        }
        if(args.extension_uuid){
            params.extension_uuid = '';
        }
        try {
        
            const initialResponse =  await fetch('/app/webtexting/deletetemplate.php?' + new URLSearchParams(params).toString())
            .then(r => r.json());
            temp = initialResponse;
            if (!initialResponse.ok) {
                emitter.emit('delete-template-failed', initialResponse);
                throw new Error(`Response status: ${initialResponse.status}`);
              }
    
            fetching = false;
            //console.log('backfillPreviews request complete');
    
            // if (initialResponse.length == 0) {
            //     emitter.emit('no-previews-found');
            // }
        } catch (e) {
            fetching = false;
            //console.log('delete template error:', e);
            emitter.emit('delete-template-failed', args.template_uuid);
        }finally{
            
            emitter.emit('delete-template-complete',(args.template_uuid));
            fetching= false;
            return  ( temp);
        }
    }
    else{
        //no args?
    }

}