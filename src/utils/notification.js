export function sendNotification(title, body) {
  if (Notification.permission === "granted") {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.showNotification(title, {
        body: body,
        icon: "./favicon.ico",
      });
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification(title, {
            body: body,
            icon: "./favicon.ico",
          });
        });
      }
    });

    // If the user has denied notifications, and you want to be respectful
    // you can change the default behavior to notify the user that they have
    // denied the use of notifications.

    Notification.requestPermission(function (permission) {
      if (permission !== "granted") {
        alert("We need to show you notifications.");
      }
    });

    // if user clicks on notification, open the app
    window.addEventListener("notificationclick", function (event) {
      console.log(event);
      if (event.target.tagName === "NOTIFICATION") {
        window.open("https://www.google.com");
      }
    });
  }
}
