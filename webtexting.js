/**
 * webtexting.js: mostly used for subscribing to webpush notifications
 */

// update displayed relative time in all class='timestamp' elements every 5 seconds
function updateTimestamps() {
    document.querySelectorAll('.timestamp').forEach((e) => {
        e.textContent = moment.utc(e.dataset.timestamp).fromNow();
    })
}
$(document).ready(() => {
    updateTimestamps();
    setInterval(updateTimestamps, 5000);
});

// callback before submitting the new thread dialog, removes any non-numeric characters from the phone number input box
function clean_number() {
    document.querySelector("#new-thread-number").value = document.querySelector("#new-thread-number").value.replace(/[^\d+]/g, "");
}


function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function toggleNotifications() {
    console.log("toggling notifications for ", window.notification_data);

    const registration = await navigator.serviceWorker.ready;
    var subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        const vapidKeyResponse = await fetch('notifications.php').then(r => r.json());
        const convertedVapidKey = urlB64ToUint8Array(vapidKeyResponse.vapid_key);

        // this displays the notification permission prompt to the user
        try {
            subscription = await registration.pushManager.subscribe({ applicationServerKey: convertedVapidKey,userVisibleOnly: true });
        } catch (e) {
            console.log("error subscribing: ", e);
            //document.querySelector('#notification-btn').style.display = 'none';
            return;
        }
    }

    const currentState = document.querySelector('#notification-btn').dataset.state;
    const toggleResponse = await fetch('notifications.php', {
        method: "POST",
        body: JSON.stringify({
            endpoint: subscription.toJSON(),
            state: (currentState == "on" || currentState == "all") ? "off" : "on",
            extension_uuid: window.notification_data.extension_uuid,
            remote_identifier: window.notification_data.remote_identifier,
        }),
    }).then((r) => r.json());
    setNotificationButtonState(toggleResponse);
}

function setNotificationButtonState(notificationState) {
    console.log("notificationState:", notificationState.state);

    const btn = document.querySelector('#notification-btn');
    if(!btn) {
        return;
    }
    btn.dataset.state = notificationState.state;

    //const icon = btn.querySelector('.fas')
    switch(notificationState.state) {
        case "all":
            if(window.notification_data.remote_identifier) {
                //btn.style.display = 'none';
                return;
            }
            // note no "break", execution continues to "on" case
        case "on":
            btn.classList.add("fa-bell");
            btn.classList.remove("fa-bell-slash");
            break;
        case "off":
            btn.classList.add("fa-bell-slash");
            btn.classList.remove("fa-bell");
            break;
    }
    
    const label = btn.querySelector('.button-label');
    if(label) {
        label.textContent = notificationState.state;
    }
}

if (window.notification_data) {
    navigator.serviceWorker.register('webtexting-worker.js').then(async function (registration) {
        const state = await registration.pushManager.permissionState({userVisibleOnly:true});
        console.log("push notification permission state:", state);
        if (state == "denied") {
            console.log("Push notification permissions denied. Please contact support@accleratenetworks.com.")
            return;
        }

        var subscription = await registration.pushManager.getSubscription();
        console.log("permissionState = " , permissionState)
        var buttonState = {state: "off"};
        if(subscription) {
            console.log(subscription.toJSON());
            buttonState = await fetch('notifications.php', {
                method: "POST",
                body: JSON.stringify({
                    endpoint: subscription.toJSON(),
                    extension_uuid: window.notification_data.extension_uuid,
                    remote_identifier: window.notification_data.remote_identifier,
                }),
            }).then((r) => r.json());
        }
        let btn = document.querySelector('#notification-btn');
        if(btn) {
            btn.style.display = 'inline-block';
            setNotificationButtonState(buttonState);
        }
    });
}
