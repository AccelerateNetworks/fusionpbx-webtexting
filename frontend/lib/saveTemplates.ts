import { emitter , addPreview, QUERY_LIMIT} from './global';

type saveTemplateQuery = {
    template_uuid?: string,
    extension_uuid: string,
    body: string,
    category?: string,
    subcategory?: string,
    language?: string,
    subject?:string,
    templateType?: string,
    enabled?: string,
    description?: string
    
}
let temp;
export async function saveTemplate(query: saveTemplateQuery){
    try{
        console.log("I'm trying" ,query)
        const response = await fetch('/app/webtexting/message-templates.php?' + new URLSearchParams(query).toString()).then(r => r);
        temp = response;
        console.log(response);
        //await fetch 
    }
    catch(e){
        console.log(e,'Failed to add template. Please contact Accelerate Networks Support.');
        //alert("Failed to add template. Please contact Accelerate Networks Support.");
        temp.message="Failed to add template. Please contact Accelerate Networks Support.";
        emitter.emit("template-save-failed",temp);
    }
    finally{
        if(temp.status==200){
            temp.action = 'Template Saved!'
            emitter.emit("template-save-complete",temp)
            console.log("finally done")
        }
        else{
            temp.message="Failed to save template. Please contact Accelerate Networks support.";            
            emitter.emit("template-save-failed",temp);
        }
        
    }
    
}
