import { MessageData } from "./global";
export async function sendMessage(message: MessageData) {
    let sending = false;
    let response;
    try {
        sending = true;
        //what happens if urlsearchparams has nothing to serialize?
        response = await fetch('/app/webtexting/outbound-hook.php?' + new URLSearchParams(JSON.stringify(message)).toString(),
                            {   method:'POST',
                                body:JSON.stringify(message)
                            })
            .then(async response =>  {
                if(response.ok){
                    let testResponse =  response.json();
                    return   testResponse;
                }
                const responseJSON = await response.text();
                return JSON.parse(responseJSON);
            });
    }
    catch (e) {
        //console.log(e);
        throw (e);
    }
    finally {
        sending = false;
        return response;
    }

}
