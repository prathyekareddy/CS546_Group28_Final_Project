notification = localStorage.getItem("notificationData");
if(typeof notificationData !== 'undefined'){
  window.localStorage.setItem(
    "notificationData",
    JSON.stringify(notificationData)
  );
}