import { MessageData, emitter, state , addPreview, query_limit} from './global';


type threadPreviewQuery = {
    query_string:String,
    extension_uuid: String
}

type loadPreviewQuery = {
    extension_uuid: String,
    older_than?: String
}

let fetching = false;

export async function searchPreviews(queryString: String, extensionUUID: String) {
    emitter.emit("previews-loading");

    if (fetching) {
        console.log("skipping duplicate search request");
        return;
    }
    fetching = true;
    let temp;
    try {
        let params: threadPreviewQuery = {  query_string: queryString, extension_uuid: extensionUUID };
        queryString = queryString.trim();
       // console.log(params)
        const response = await fetch('/app/webtexting/searchpreviews.php?' + new URLSearchParams(params).toString()).then(r => r.json());
        
        temp = response;
        // for (let i = 0; i < response.length; i++) {
        //     let m = response[i];
        //     //console.log(m)
        //             //insertPreview();
        //     }
        

        // fetching = false;
        // //console.log('backfill request complete');

        // if (response.length == 0) {
        //     emitter.emit('no-previews-found');
        // }
        
    } catch (e) {
        fetching = false;
        console.log('load preview error:', e);
    } finally{
        console.log(temp);
        emitter.emit('backfill-preview-complete',temp);
        fetching= false;
        return buildPreviews( temp);
    }
}
//what identifiers and data do we need
//maybe threadpreviewinterface
export function insertPreview() {
    //check for Preview in previewList
    if(state.conversations[key]){
        for (let i = 0; i < state.conversations[key].length; i++) {
            if (state.conversations[key][i].id == message.id) {
                state.conversations[key][i] = message;
                return;
            }
    
            if (state.conversations[key][i].timestamp.isAfter(message.timestamp)) {
                state.conversations[key].splice(i, 0, message);
                return;
            }
        }
    }
    //add a new preview if no preview is found
    else{
        state.conversations[key] = new Array<MessageData>();
    }
    // no existing message matched, append to end    
    state.conversations[key].push(message);
}


export async function loadPreviews(extensionUUID:string, older_than:string) {
    if (fetching) {
        console.log("skipping duplicate search request");
        return;
    }
    fetching = true;
    emitter.emit("previews-loading");
    let temp;
    try {
        let params: loadPreviewQuery = {  extension_uuid: extensionUUID, };
        if(older_than){
            params.older_than = older_than;
        }
        const initialResponse =  await fetch('/app/webtexting/loadpreviews.php?' + new URLSearchParams(params).toString()).then(r => r.json());
        temp = initialResponse;
        //console.log("received", initialResponse.length, "preview from database");
        // for (let i = 0; i < response.length; i++) {
        //     let m = response[i];
        //     //console.log(m)
        //             //insertPreview();
        //     }
        

        fetching = false;
        //console.log('backfill request complete');

        // if (initialResponse.length == 0) {
        //     emitter.emit('no-previews-found');
        // }
        
    } catch (e) {
        fetching = false;
        console.log('load preview error:', e);
    }finally{
        if(temp.length< query_limit){
            emitter.emit("no-more-previews");
        }
        //console.log(temp);
        emitter.emit('backfill-preview-complete',temp);
        fetching= false;
        
        return  buildPreviews( temp);
    }

}

export const buildPreviews =  function buildPreviews(previews ) {
    //console.log( previews)
    //let threadPreviewMap = new Map<String, ThreadPreviewInterface>();
    if(previews && previews.length){
        for(let x = 0; x < previews.length; x++){
            //console.log(opts[x])
            if(previews[x].groupUUID){
                // if(opts[x].groupMembers){
                //     //php delviers us a string of comma separated values instead of an array the rest of the app expects an array of strings
                //     console.log(opts[x].groupMembers);
                //     opts[x].groupMembers = opts[x].groupMembers.split(", ")
                //     console.log(opts[x].groupMembers);
                // }
               // console.log(previews[x]);
               // threadPreviewMap.set(previews[x].groupUUID, previews[x])
                addPreview(previews[x]);
            }
            else if(previews[x].remoteNumber){
             //   threadPreviewMap.set(previews[x].remoteNumber, previews[x])
               // console.log(previews[x])
                addPreview(previews[x]);
            }
            else{
                console.log(("Contact has no identifier. Missing Group UUID and Phone Number"));
            }
        }
    }
    console.log("emitting PDL");
    emitter.emit("previews-done-loading");  
    //below not for deployment       
    emitter.emit('inital-load-complete');

    return ;
}