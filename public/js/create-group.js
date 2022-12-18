
function createGroupFormValidation(
  groupImage,
  groupName,
  category,
  platformName,
  platformEmail,
  platformPassword,
  groupLimit,
  duePaymentDate,
  subscriptionPrice,
  subscriptionLengthInMonths,
  hashTag
) {
  //Group image validations
  if (!groupImage) {
    throw "Group Image is required!";
  }

  if (
    groupImage.type !== "image/jpg" &&
    groupImage.type !== "image/png" &&
    groupImage.type !== "image/jpeg"
  ) {
    throw "Only JPG,PNG and JPEG formats are allowed!";
  }

  //Group name validations
  if (!groupName || groupName === "undefined") {
    throw "You must provide a group name!";
  }
  groupName = groupName.trim();
  if (groupName.length === 0) {
    throw "group name cannot be an empty string or a string with just spaces";
  }
  if (groupName.length < 2) {
    throw "group name must be of atleast two characters";
  }
  let groupNameReg = new RegExp("^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$");
  if (!groupName.match(groupNameReg)) {
    throw new Error("group name can only be Alphanumerical");
  }

  //Category validation
  if (!category) {
    throw "You must select a category";
  }

  //Platform name validations
  if (!platformName || platformName === "undefined") {
    throw "You must provide a Platform name";
  }
  platformName = platformName.trim();
  if (platformName.length === 0) {
    throw "Platform name cannot be an empty string or a string with just spaces";
  }
  if (platformName.length < 2) {
    throw "The platform name must be of atleast two characters";
  }
  let platformNameReg = new RegExp(
    "^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$"
  );
  if (!platformName.match(platformNameReg)) {
    throw new Error("Platform name can only be Alphanumerical");
  }

  //Platform email validation
  if (!platformEmail || platformEmail === "undefined") {
    throw "You must provide the Platform email";
  }
  platformEmail = platformEmail.trim();
  if (platformEmail.length === 0) {
    throw "The platform email cannot be an empty string or a string with just spaces";
  }

  //Platform password validation
  if (!platformPassword || platformPassword === "undefined") {
    throw "You must provide the Platform Password";
  }
  platformPassword = platformPassword.trim();
  if (platformPassword.length === 0) {
    throw "The platform password cannot be an empty string or a string with just spaces";
  }

  //Group limit validations
  if (groupLimit) {
    if (groupLimit.includes(".")) {
      throw "Decimals values are not allowed";
    }
    groupLimit = groupLimit.trim();
    if (groupLimit.length === 0)
      throw "Group Limit cannot be an empty string or a string with just spaces";
    groupLimit = Number(groupLimit);
    if (typeof groupLimit != "number" || Number.isNaN(groupLimit))
      throw "Group Limit must be an integer";
    if (groupLimit < 1) {
      throw "The Group limit is atleast 1";
    }
  }
    //Payment due date validations
    const date = new Date();

    if (!duePaymentDate) {
      throw "PaymentDueDate is required";
    }

  //   if(duePaymentDate){

  //   let dueDate = new Date(duePaymentDate);
  //   duePaymentDate = dueDate.toLocaleDateString("en-US");

  //   console.log(duePaymentDate)

  //   if (duePaymentDate.length !== 10) {
  //     throw "PaymentDueDate must be in the mm/dd/yyyy format";
  //   }
  //   if (
  //     duePaymentDate.slice(2, 3) !== "/" ||
  //     duePaymentDate.slice(5, 6) !== "/"
  //   ) {
  //     throw "PaymentDueDate must be in the mm/dd/yyyy format";
  //   }
  //   let currMonth = date.toLocaleDateString().slice(0, 2);
  //   let currDay = date.toLocaleDateString().slice(-7, -5);
  //   let currYear = date.toLocaleDateString().slice(-4);

  //   let dueDay = Number(duePaymentDate.slice(0, 2));
  //   let dueMonth = Number(duePaymentDate.slice(3, 5));
  //   let dueYear = Number(duePaymentDate.slice(6));

  //   if (
  //     Number.isNaN(dueMonth) ||
  //     Number.isNaN(dueDay) ||
  //     Number.isNaN(dueYear)
  //   ) {
  //     throw "Day, Month and Year must be numbers";
  //   }

  //   if (dueMonth < 1 || dueMonth > 12) {
  //     throw "Month must be between 1-12";
  //   }
  //   if (dueDay < 1 || dueDay > 31) {
  //     throw "Day must be between the range 1-31";
  //   }
  //   if (dueMonth === 2 && dueDay > 28) {
  //     throw "February can not contain more than 28 days";
  //   }
  //   if (dueMonth === 4 || dueMonth === 6 || dueMonth === 9 || dueMonth === 11) {
  //     if (dueDay > 30) {
  //       throw `PaymentDueDate cannot be 31 for the month ${dueMonth}`;
  //     }
  //   }

  //   if (dueYear < currYear) {
  //     throw "Year cannot be in the past";
  //   }

  //   if (dueYear == currYear) {
  //     if (dueMonth < currMonth) {
  //       throw "PaymentDueDate cannot be in the past";
  //     }
  //   }

  //   if (dueMonth == currMonth) {
  //     if (dueYear == currYear && dueDay < currDay)
  //       throw "PaymentDueDate cannot be in the past";
  //   }
  // }

  //Subscription Price validation
  if (subscriptionPrice) {
    if (subscriptionPrice <= 0) {
      throw "Subscription price cannot be less than or equal to 0";
    }
    subscriptionPrice = Number(subscriptionPrice);
    if (
      typeof subscriptionPrice !== "number" ||
      Number.isNaN(subscriptionPrice)
    ) {
      throw "Subscription price must be a number";
    }
  }

  //Subscription Length in months validation
  if (subscriptionLengthInMonths) {
    if (subscriptionLengthInMonths.includes(".")) {
      throw "Decimals values are not allowed";
    }
    subscriptionLengthInMonths = subscriptionLengthInMonths.trim();
    subscriptionLengthInMonths = Number(subscriptionLengthInMonths);
    if (
      typeof subscriptionLengthInMonths !== "number" ||
      Number.isNaN(subscriptionLengthInMonths)
    ) {
      throw "Subscription month in days must be a number";
    }
    if (subscriptionPrice <= 0) {
      throw "Subscription duration in months cannot be less than or equal to 0";
    }
  }

  //Hashtag validation
  if (hashTag) {
    if (hashTag.trim().length !== 0) {
      let hashTagReg = new RegExp(
        "^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$"
      );
      if (!hashTag.match(hashTagReg)) {
        // throw new Error("Hashtags can only be Alphanumerical");
      }
    }
  }

  return {
    groupName,
    category,
    platformName,
    platformEmail,
    platformPassword,
    groupLimit,
    duePaymentDate,
    subscriptionPrice,
    subscriptionLengthInMonths,
    hashTag
  };
};

async function createGroup(event) {
  event.preventDefault();

  //Finding elements by its Id
  let createGroupForm = document.getElementById('createGroupForm');
  let error = document.getElementById('error');
  error.hidden = true;

  let groupName = document.getElementById('group-name').value;
  let category = document.getElementById('category').value;
  let platformName = document.getElementById('platform-name').value;
  let platformEmail = document.getElementById('platform-email').value;
  let platformPassword = document.getElementById('platform-password').value;
  let groupLimit = document.getElementById('group-limit').value;
  let duePaymentDate = document.getElementById('due-date').value;
 
  let subscriptionPrice = document.getElementById('total-subs-price').value;
  let subscriptionLengthInMonths = document.getElementById('subs-length').value;
  let groupImage = document.getElementById('groupImage').files[0];
  let hashTag = document.getElementById('hashtags').value;
  
  if (createGroupForm) {
    try {
      validForm = createGroupFormValidation(groupImage,groupName, category, platformName, platformEmail, platformPassword, groupLimit, duePaymentDate, subscriptionPrice, subscriptionLengthInMonths, hashTag);
    }
    catch (e) {
      error.hidden = false;
      error.innerHTML = e;
      return;
    }
  }
  let formData = new FormData();
  formData.append('groupName', groupName);
  formData.append('category', category);
  formData.append('platformName', platformName);
  formData.append('platformEmail', platformEmail);
  formData.append('platformPassword', platformPassword);
  formData.append('groupLimit', groupLimit);
  let dueDate = new Date(duePaymentDate);
  dueDate=dueDate.toLocaleDateString('en-US');
  formData.append('dueDate', dueDate);
  formData.append('totalSubsPrice', subscriptionPrice);
  formData.append('subsLength', subscriptionLengthInMonths);
  formData.append('groupImage', groupImage);
  formData.append('hashtags', hashTag);

  await fetch('/navigation/create', {
    method: "POST",
    body: formData
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error && result.groupName) {
        error.hidden = false;
        error.innerHTML = result.groupName;
      } 
      else if (result.error && result.category) {
        error.hidden = false;
        error.innerHTML = result.category;
      } 
      else if (result.error && result.groupLimit) {
        error.hidden = false;
        error.innerHTML = result.groupLimit;
      }
      else if (result.error && result.platformName) {
        error.hidden = false;
        error.innerHTML = result.platformName;
      }
      else if (result.error && result.platformEmail) {
        error.hidden = false;
        error.innerHTML = result.platformEmail;
      }
      else if (result.error && result.platformEmail) {
        error.hidden = false;
        error.innerHTML = result.platformEmail;
      }
      else if (result.error && result.password) {
        error.hidden = false;
        error.innerHTML = result.password;
      }
      else if (result.error && result.dueDate) {
        error.hidden = false;
        error.innerHTML = result.dueDate;
      }
      else if (result.error && result.totalSubsPrice) {
        error.hidden = false;
        error.innerHTML = result.totalSubsPrice;
      }
      else if (result.error && result.subsLength) {
        error.hidden = false;
        error.innerHTML = result.subsLength;
      }
      else if (result.error) {
        error.hidden = false;
        error.innerHTML = result.message;
      }
      else {
        alert('Group Created successfully.');
        window.location.assign('http://localhost:3000/navigation/groupdetails/' + result.id);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}