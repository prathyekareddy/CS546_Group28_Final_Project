async function requestNotification(id) {
    const notificationCount = document.getElementById("notification-count");
    notificationCount.textContent = "";
  
    // const notification = document.getElementById("notification");
    // if (notification.childNodes.length === 0){
    //     notification.style.visibility = "hidden"
    // } else {
    //     notification.style.visibility = "visible"
    // }
  
    notificationData = JSON.parse(
      window.localStorage.getItem("notificationData")
    );
    let requestData = [];
    notificationData.forEach((element) => {
      requestData.push({
        groupId: element._id,
        readRequestToJoin: element.requestToJoin,
      });
    });
  
    let body = { readRequestList: requestData };
  
    await fetch("/navigation/notifications-read-update", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((result) => {})
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  window.onload = async function init() {
    const notificationCount = document.getElementById("notification-count");
  
    await fetch("/navigation/notifications-list", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        let countNotification = 0;
        let countNotificationFlag = false;
        for (let element of result.data) {
          let unReadUserList = element.unReadUser;
          for (let unReadUser of unReadUserList) {
            countNotification = countNotification + 1;
            countNotificationFlag = true;
          }
          if (countNotificationFlag) {
            notificationCount.textContent = countNotification;
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    let notificationData = JSON.parse(
      window.localStorage.getItem("notificationData")
    );
    const notification = document.getElementById("notification");
    if (notificationData.length > 0) {
      for (let element of notificationData) {
          
          let unReadUserList = element.unReadUser;
          for (let unReadUser of unReadUserList) {
            let newNotiMes = document.createElement("a");
            newNotiMes.classList.add("dropdown-item");
          newNotiMes.textContent = `${unReadUser.firstName} ${unReadUser.lastName} requested to join ${element.groupName}`;
          notification.appendChild(newNotiMes);
        }
      }
    } else {
      let newNotiMes = document.createElement("span");
      newNotiMes.classList.add("zero");
      newNotiMes.textContent = "No New Notifications";
      notification.appendChild(newNotiMes);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("notificationData");
    const temp = document.createElement("a");
    temp.href = "/logout";
    temp.click();
    console.log("logout");
  };