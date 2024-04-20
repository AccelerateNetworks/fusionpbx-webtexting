let updatingLastSeen = false;
export async function updateLastSeen(extensionUUID:string, threadUUID:string){
    if(updatingLastSeen){
        console.log("skipping duplicate userLastSeen update")
        return;
    }
    updatingLastSeen = true;
    const ulsParams = {extension_uuid: extensionUUID, thread_uuid: threadUUID};
    try{
        const ULSResponse = fetch("/app/webtexting/last_seen.php"+new URLSearchParams(ulsParams).toString()).then(r => r.json())
    }
    catch(e){
        updatingLastSeen = false;
        console.log('backfill error:', e);
    }
    finally{
        updatingLastSeen = false;
    }
}