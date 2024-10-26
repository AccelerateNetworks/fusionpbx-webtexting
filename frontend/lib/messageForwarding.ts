import { log } from "console";

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
        });
        if(test.ok){
            return await test;
        }
        else{
            throw new Error(`Response status: ${test.status}`)
        }
    }
    catch(e){
        console.log(e);
        throw(e);
    }
    finally{
        console.log("finally done registering")
        //console.log(await test.json());
        fetching= false;
        return await test;
    }
    
}