let updatingLastSeen = false;
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