notification = localStorage.getItem("notificationData");
if (!notification || notification === "[]") {
  window.localStorage.setItem(
    "notificationData",
    JSON.stringify(notificationData)
  );
}