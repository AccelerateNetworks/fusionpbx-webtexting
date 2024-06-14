import { emitter , addPreview, QUERY_LIMIT} from './global';


type threadPreviewQuery = {
    query_string:String,
    extension_uuid: String
}

type loadPreviewQuery = {
    extension_uuid: String,
    older_than?: String
}

let fetching = false;

//Grab the data we need to create the thread previews from the database
//INPUTS: extensionUUID = the user's extension we want to build previews for
//        queryString = the user's string that they want to search their threads for
//OUTPUT: None (buildPreviews calls addPreviews which constructs the previews map for global state)
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


//Grab the data we need to create the thread previews from the database
//INPUTS: extensionUUID = string representation of the user's extension we want to build previews for
//        (optional) older_than = string representation of a timestamp that we want to check if previews are older than (used for loading older previews)
//OUTPUT: None (buildPreviews calls addPreviews which constructs the previews map for global state)
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
        

        fetching = false;
        //console.log('backfillPreviews request complete');

        // if (initialResponse.length == 0) {
        //     emitter.emit('no-previews-found');
        // }
        
    } catch (e) {
        fetching = false;
        console.log('load preview error:', e);
    }finally{
        if(temp.length< QUERY_LIMIT){
            emitter.emit("no-more-previews");
        }
        emitter.emit('backfill-preview-complete',temp);
        fetching= false;
        console.log(temp)
        return  buildPreviews( temp);
    }

}

//Calls addPreview for each object in a supplied rpeviews array
//INPUTS: previews = untyped array of objects that contain the data needed to construct a valid ThreadPreview component
//OUTPUTS: None (the threadPreviews state object is constructed/updated in addPreview ) 
export const buildPreviews =  function buildPreviews(previews ) {
    //console.log( previews)
    if(previews && previews.length){
        for(let x = 0; x < previews.length; x++){
            if(previews[x].groupUUID){
                addPreview(previews[x]);
            }
            else if(previews[x].remoteNumber){
                addPreview(previews[x]);
            }
            else{
                console.log(("Contact has no identifier. Missing Group UUID and Phone Number"));
                console.log(previews[x]);
            }
        }
    }
    console.log("emitting PDL");
    emitter.emit("previews-done-loading");  
    //below not for deployment       
    //emitter.emit('inital-load-complete');

    return ;
}