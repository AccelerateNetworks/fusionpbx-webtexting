import { BaseTransitionPropsValidators } from "vue";
import { emitter } from "./global";
//new type for luaSkip[ response?]
export type LuaSkipMessageData = {
    direction: string;
    contentType: string;
    timestamp: Moment;
    id?: string;
    from: string;
    to: string;
    body?: string;
    cpim?: CPIM;
    extensionUUID?: string;
    from_host?: string;
    status?: string;
    statusText?: string;
}
export async function luaSkip(message: LuaSkipMessageData) {
    let sending = false;
    let response;
    try {
        //console.log("[luaSkip] I'm trying " + message);
        sending = true;
        response = await fetch('/app/webtexting/outbound-hook.php?' + new URLSearchParams(message).toString(),
                            {   method:'POST',
                                body:JSON.stringify(message)
                            }
                        )
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
