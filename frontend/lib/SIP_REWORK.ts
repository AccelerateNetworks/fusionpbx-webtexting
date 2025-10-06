import { emitter } from "./global";
import { ClientResponse } from "./checkIfForwarded";
export async function luaSkip(message){
    let sending = false;
    let response;
    try {
        console.log("[luaSkip] I'm trying " + message);
        sending = true;
        response = await fetch('/app/webtexting/outbound-hook.php?' + new URLSearchParams(message).toString(),
                            {   method:'POST',
                                body:JSON.stringify(message)
                            }
                        )
            .then(res =>  res);
    }
    catch (e) {
        console.log(e);
        throw (e);
    }
    finally {
        //console.log("[luaSkip] done!");
        sending = false;
        // TODO: Run this throught the debugger and see if it's a string or object, then correct the type.
        emitter.emit('luaSkip-done', response);
        return response;
    }

}
