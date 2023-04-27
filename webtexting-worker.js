const channel = new BroadcastChannel('message-pushes');

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  event.waitUntil(
    // Retrieve a list of the clients of this service worker.
    self.clients.matchAll().then(function (clientList) {
      console.log(clientList, event);

      const payload = event.data.json();

      channel.postMessage(payload);

      var tab = clientList.some(function (client) {
        let u = new URL(client.url);
        return u.searchParams.get('extension_uuid') == payload.to && u.searchParams.get('number') == payload.from;
      });

      if(tab) {
        console.log("tab with conversation exists");
        if(tab.focused) {
          console.log('tab with conversation is focused, not sending notification');
          return;
        }
      }

      return self.registration.showNotification(payload.display_name, {body: payload.body});
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  e.notification.close();
  event.waitUntil(
    self.clients.matchAll().then(function (clientList) {
      var tab = clientList.some(function (client) {
        let u = new URL(client.url);
        return u.searchParams.get('extension_uuid') == payload.to && u.searchParams.get('number') == payload.from;
      });

      if(tab) {
        tab.focus();
      } else {
        let u = self.origin + '/app/webtexting/thread.php?extension_uuid=' + payload.to + '&number=' + payload.from;
        console.log('opening URL:', u);
        self.clients.openWindow(u)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
      }
    })
  );
});
