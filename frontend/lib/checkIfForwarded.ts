import { emitter } from "./global";

export type checkForwardingRequest = {
    dialed_number: string,
    extension_uuid: string
}

export type ClientResponse = {
    clientRegistrationId: String,
    asDialed: String,
    callbackUrl: String,
    dateRegistered: String,
    clientSecret: String,
    registeredUpstream: Boolean,
    upstreamStatusDescription: String,
    dateLastTestMessageReceived: String,
    email: String,
    emailVerified: Boolean
}

export async function checkIfForwardedAddress(query: checkForwardingRequest) {
    let fetching = false;
    let test: ClientResponse;
    try {
        //console.log("[checkIfForwardedAddress] I'm trying " + query);
        fetching = true;
        test = await fetch('/app/webtexting/check-forwarding.php?' + new URLSearchParams(query).toString())
            .then(res => res.json());
    }
    catch (e) {
        //console.log(e);
        throw (e);
    }
    finally {
        //console.log("[checkIfForwardedAddress] done checking for previous email forwarding registrations")
        fetching = false;
        // TODO: Run this throught the debugger and see if it's a string or object, then correct the type.
        emitter.emit('forwarding-check-response', JSON.parse(test.toString()));
        return test;
    }

}