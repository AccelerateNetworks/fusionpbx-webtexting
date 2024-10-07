export type registerForwardingRequest={
    own_number:String,
    extension_uuid: String,
    email_address: String
}
export async function registerForwardAddress(query:registerForwardingRequest){
    let fetching = false;
    try{
        console.log("I'm trying" ,query);
        fetching = true;
        const response = await fetch('/app/webtexting/register_forwarding.php?' + new URLSearchParams(query).toString()).then(r => r.json());
        //await fetch 
    }
    catch(e){

    }
    finally{
        console.log("finally done registering")
        fetching= false;
    }
    
}