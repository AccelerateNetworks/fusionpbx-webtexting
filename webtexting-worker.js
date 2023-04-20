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

      // Check if there's at least one focused client.
      var focused = clientList.some(function (client) {
        return client.focused;
      });

      if (!focused) {
        return self.registration.showNotification(payload.display_name, {
          body: payload.body,
        });
      }
    })
  );
});

// Register event listener for the 'notificationclick' event.
self.addEventListener('notificationclick', function (event) {
  event.waitUntil(
    // Retrieve a list of the clients of this service worker.
    self.clients.matchAll().then(function (clientList) {
      // If there is at least one client, focus it.
      if (clientList.length > 0) {
        return clientList[0].focus();
      }

      // Otherwise, open a new page.
      return self.clients.openWindow('../push-clients_demo.html');
    })
  );
});
