import { log } from "console";
import { emitter } from "./global";
export type registerForwardingRequest={
    dialed_number:string,
    email: string,
    extension_uuid: string
}
export async function registerForwardAddress(query:registerForwardingRequest){
    let fetching = false;
    let test ;
    try{
        console.log("I'm trying "  +query);
        fetching = true;
        test= await fetch('/app/webtexting/register-forwarding.php?' + new URLSearchParams(query).toString(),{
            method:"POST"
        }).then(res => res.json())
    }
    catch(e){
        console.log(e);
        throw(e);
    }
    finally{
        console.log("finally done registering for forwarding")
        emitter.emit("completed-email-forwarding-registration",test)
        fetching= false;
        return  test;
    }
    
}