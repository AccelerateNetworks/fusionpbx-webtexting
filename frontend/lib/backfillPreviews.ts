import { emitter, addPreview, QUERY_LIMIT } from './global';

let fetching = false;

type ThreadPreviewResponse = {
    remoteNumber: string,
    displayName: string,
    contactEditLink: string,
    threadUUID?: string,
    groupUUID?: string,
    groupMembers?: string[],
    link: string,
    ownNumber: string,
    timestamp: string,
    bodyPreview: string,
    newMessages: Number
}

// Grab the data we need to create the thread previews from the database
// INPUTS: extensionUUID = the user's extension we want to build previews for
//        queryString = the user's string that they want to search their threads for
// OUTPUT: None (buildPreviews calls addPreviews which constructs the previews map for global state)
export async function searchPreviews(queryString: string, extensionUUID: string) {
    emitter.emit("previews-loading");

    if (fetching) {
        //console.log("[backfillPreviews.searchPreviews] Skipping duplicate search request.");
        return;
    }
    fetching = true;
    let temp: ThreadPreviewResponse[];
    try {
        // https://nodejs.org/api/url.html#class-urlsearchparams
        const params = `query_string=${queryString}&extension_uuid=${extensionUUID}`
        queryString = queryString.trim();
        // console.log(params)
        const response: ThreadPreviewResponse[] = await fetch('/app/webtexting/searchpreviews.php?' + new URLSearchParams(params).toString()).then(r => r.json());

        temp = response;
        // if (response.length == 0) {
        //     emitter.emit('no-previews-found');
        // }

    } catch (e) {
        fetching = false;
        //console.log('[backfillPreviews.searchPreviews] Load preview error:', e);
    } finally {
        //console.log(temp);
        //('[backfillPreviews.searchPreviews] Backfill-preview-complete', temp);
        fetching = false;
        return buildPreviews(temp);
    }
}


// Grab the data we need to create the thread previews from the database
// INPUTS: extensionUUID = string representation of the user's extension we want to build previews for
//        (optional) older_than = string representation of a timestamp that we want to check if previews are older than (used for loading older previews)
// OUTPUT: None (buildPreviews calls addPreviews which constructs the previews map for global state)
export async function loadPreviews(extensionUUID: string, older_than?: string) {
    console.log("[backfillPreviews.loadPreviews] Loading more previews...", extensionUUID, older_than);
    if (fetching) {
        //console.log("[backfillPreviews.loadPreviews] Skipping duplicate search request.");
        return;
    }
    fetching = true;
    emitter.emit("previews-loading");
    let temp: ThreadPreviewResponse[];
    try {
        // https://nodejs.org/api/url.html#class-urlsearchparams
        const params = older_than ? `extension_uuid=${extensionUUID}&older_than=${older_than}` : `extension_uuid=${extensionUUID}`;
        const initialResponse: ThreadPreviewResponse[] = await fetch('/app/webtexting/loadpreviews.php?' + new URLSearchParams(params).toString()).then(r => r.json());
        temp = initialResponse;
        console.log(initialResponse);

        fetching = false;
        //console.log('backfillPreviews request complete');

        // if (initialResponse.length == 0) {
        //     emitter.emit('no-previews-found');
        // }

    } catch (e) {
        fetching = false;
        console.log('[backfillPreviews.loadPreviews] Load preview error:', e);
    } finally {
        
        emitter.emit('backfill-preview-complete', temp);
        fetching = false;
        //console.log(temp)
        console.log('bpc')
        if (temp.length < QUERY_LIMIT) {
            emitter.emit("no-more-previews");
        }
        return buildPreviews(temp);
    }

}

// Calls addPreview for each object in a supplied previews array
// INPUTS: previews = untyped array of objects that contain the data needed to construct a valid ThreadPreview component
// OUTPUTS: None (the threadPreviews state object is constructed/updated in addPreview ) 
export const buildPreviews = function buildPreviews(previews: ThreadPreviewResponse[]):void {
    console.log( previews);
    //console.log(Object.keys(previews).length);
    let previewsLength = Object.keys(previews).length;
    if (previews && previewsLength) {
        for (let x = 0; x < previewsLength; x++) {
            //console.log(previews[x])
            if (previews[x].groupUUID) {
                addPreview(previews[x]);
            }
            else if (previews[x].remoteNumber) {
                addPreview(previews[x]);
            }
            else {
                console.log(("[backfillPreviews.buildPreviews] Contact has no identifier. Missing Group UUID and Phone Number"));
                console.log(previews[x]);
            }
        }
    }
    console.log("[backfillPreviews.buildPreviews] emitting PDL");
    emitter.emit("previews-done-loading");
    //below not for deployment       
    //emitter.emit('inital-load-complete');

    return;
}