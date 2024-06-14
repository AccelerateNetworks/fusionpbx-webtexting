let updatingLastSeen = false;
//this function is called when a user selects a threadpreview and the conversation component is rendered
//when this function is called it updates the database so that we can keep track of messages recieved since the last time a user accessed that conversations
//this is how we keep track of persistent unreads
export async function updateLastSeen(updateULSObject:updateUserLastSeenOptions){
    if(updatingLastSeen){
        console.log("skipping duplicate userLastSeen update")
        return;
    }
    updatingLastSeen = true;
    const ulsParams = {extension_uuid: updateULSObject.extension_uuid, thread_uuid: updateULSObject.thread_uuid};
    try{
        const ULSResponse = fetch("/app/webtexting/last_seen.php?"+new URLSearchParams(ulsParams).toString()).then(r => r.json())
    }
    catch(e){
        updatingLastSeen = false;
        console.log('Update last seen error:', e);
    }
    finally{
        updatingLastSeen = false;
    }
}
export type updateUserLastSeenOptions = {
    extension_uuid: string,
    thread_uuid: string,
}