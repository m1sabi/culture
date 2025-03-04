self.addEventListener("install", (event) => {
    console.log("Service Worker Installed ✅");
    self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker Activated ✅");
    event.waitUntil(self.clients.claim()); // Take control of all pages
});

// Handle push notification for Azan
self.addEventListener("push", (event) => {
    const options = {
        body: event.data ? event.data.text() : "It's prayer time! ⏰",
        icon: "azan_icon.png", // Ensure this icon exists
        badge: "azan_icon.png",
        vibrate: [200, 100, 200], // Vibration pattern
        data: { primaryKey: 1 },
        actions: [{ action: "stop", title: "Stop Azan", icon: "stop_icon.png" }]
    };

    event.waitUntil(
        self.registration.showNotification("📢 Azan Alert", options)
    );
});

// Handle user clicking on notification
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.action === "stop") {
        // Stop Azan when user clicks "Stop Azan"
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => client.postMessage({ action: "stopAzan" }));
        });
    }
});
