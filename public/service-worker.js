if (typeof importScripts === "function") {
  importScripts("https://js.pusher.com/beams/service-worker.js")
}

PusherPushNotifications.onNotificationReceived = ({
                                                    pushEvent,
                                                    payload,
                                                    handleNotification,
                                                  }) => {
  console.log("Worker got:", payload)

  pushEvent.waitUntil(
      Promise.resolve()
          .then(() => handleNotification(payload))
          .then(() => {
            console.log("Notification handled successfully")
          })
          .catch((error) => {
            console.error("Notification handling failed:", error)
          }),
  )

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(payload.data)
    })
  })
}