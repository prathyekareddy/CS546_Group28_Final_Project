//Finding elements by its Id
let createGroupForm = document.getElementById('createGroupForm');
let error = document.getElementById('error');
let groupName = document.getElementById('group-name');
let category = document.getElementById('category');
let platformName = document.getElementById('platform-name');
let platformEmail = document.getElementById('platform-email');
let platformPassword = document.getElementById('platform-password');
let groupLimit = document.getElementById('group-limit');
let duePaymentDate = document.getElementById('due-date');
let subscriptionPrice = document.getElementById('total-subs-price');
let subscriptionLengthInMonths = document.getElementById('subs-length');
//let profilePicture = document.getElementById('profile-picture');

const createGroupFormValidation = async (
groupName,
category,
platformName,
platformEmail,
platformPassword,
groupLimit,
duePaymentDate,
subscriptionPrice,
subscriptionLengthInMonths
) => {

//Group name validations
if (!groupName || groupName === 'undefined') {
  throw 'You must provide a Group Name!';
}
groupName = groupName.trim();
if (groupName.length === 0) {
  throw 'Group Name cannot be an empty string or a string with just spaces';
}
if (groupName.length < 2) {
  throw 'The group name must be of atleast two characters';
}
let groupNameReg = new RegExp("^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$");
if (!groupName.match(groupNameReg)) {
  throw new Error('Group Name can only be Alphanumerical');
}

//Category validation
if (!category) {
  throw 'You must select a category';
}

//Platform name validations
if (!platformName || platformName === 'undefined') {
  throw 'You must provide a Platform name';
}
platformName = platformName.trim();
if (platformName.length === 0) {
  throw 'Platform name cannot be an empty string or a string with just spaces';
}
if (platformName.length < 2) {
  throw 'The platform name must be of atleast two characters';
}
let platformNameReg = new RegExp("^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$");
if (!platformName.match(platformNameReg)) {
  throw new Error('Platform name can only be Alphanumerical');
}

//Platform email validation
if (!platformEmail || platformEmail === 'undefined') {
  throw 'You must provide the Platform email';
}
platformEmail = platformEmail.trim();
if (platformEmail.length === 0) {
  throw 'The platform email cannot be an empty string or a string with just spaces';
}
let platformEmailReg =  new RegExp("^[a-zA-Z]+[a-zA-Z0-9_-]*@([a-zA-Z0-9]+){1}(\.[a-zA-Z0-9]+){1,2}");
if (!platformEmail.match(platformEmailReg)) {
  throw new Error('Platform email must be in a valid email format');
}

//Platform password validation
if (!platformPassword || platformPassword === 'undefined') {
  throw 'You must provide the Platform Password';
}
platformPassword = platformPassword.trim();
if (platformPassword.length === 0) {
  throw 'The platform password cannot be an empty string or a string with just spaces';
}

//Group limit validations
if (groupLimit) {
  if (groupLimit.includes(".")) {
    throw 'Decimals values are not allowed';
  }
  groupLimit = groupLimit.trim();
  if (groupLimit.length === 0)
    throw 'Group Limit cannot be an empty string or a string with just spaces';
  groupLimit = Number(groupLimit);
  if (typeof groupLimit != "number" || Number.isNaN(groupLimit))
    throw 'Group Limit must be an integer';
  if (groupLimit < 1) {
    throw 'The Group limit is atleast 1';
  }

  //Payment due date validations
  // const date = new Date();
  // if (duePaymentDate.length !== 10) {
  //   throw "Date must be in the mm/dd/yyyy format";
  // }
  // if (duePaymentDate.slice(2, 3) !== "/" || duePaymentDate.slice(5, 6) !== "/") {
  //   throw "Date must be in the mm/dd/yyyy format";
  // }
  // let currMonth = date.toLocaleDateString().slice(0, 2);
  // let currDay = date.toLocaleDateString().slice(-7, -5);
  // let currYear = date.toLocaleDateString().slice(-4);

  // let dueMonth = Number(duePaymentDate.slice(0, 2));
  // let dueDay = Number(duePaymentDate.slice(3, 5));
  // let dueYear = Number(duePaymentDate.slice(6));

  // if (Number.isNaN(dueMonth) || Number.isNaN(dueDay) || Number.isNaN(dueYear)) {
  //   throw 'Day, Month and Year must be numbers';
  // }

  // if (dueMonth < 1 || dueMonth > 12) {
  //     throw 'Month must be between 1-12';
  // }
  // if (dueDay < 1 || dueDay > 31) {
  //   throw 'Day must be between the range 1-31';
  // }
  // if (dueMonth === 2 && dueDay > 28) {
  //   throw 'February can not contain more than 28 days';
  // }
  // if (dueMonth === 4 || dueMonth === 6 || dueMonth === 9 || dueMonth === 11) {
  //   if (dueDay > 30) {
  //     throw `Date cannot be 31 for the month ${dueMonth}`;
  //   }
  // }

  // if (dueYear < currYear) {
  //   throw 'Year cannot be in the past';
  // }

  // if (dueYear == currYear) {
  //   if (dueMonth < currMonth) {
  //     throw 'Payment due date cannot be in the past';
  //   }
  // }

  // if (dueMonth == currMonth) {
  //   if (dueYear == currYear && dueDay < currDay)
  //     throw 'Payment due date cannot be in the past';
  // }
}

//Subscription Price validation
if (subscriptionPrice) {
  if (subscriptionPrice <= 0) {
    throw 'Subscription price cannot be less than or equal to 0';
  }
  subscriptionPrice = Number(subscriptionPrice);
  if (typeof subscriptionPrice !== "number" || Number.isNaN(subscriptionPrice)) {
    throw 'Subscription price must be a number';
  }
}

//Subscription Length in months validation
if (subscriptionLengthInMonths) {
  if (subscriptionLengthInMonths.includes(".")) {
    throw 'Decimals values are not allowed';
  }
  subscriptionLengthInMonths = subscriptionLengthInMonths.trim();
  subscriptionLengthInMonths = Number(subscriptionLengthInMonths);
  if (typeof subscriptionLengthInMonths !== "number" || Number.isNaN(subscriptionLengthInMonths)) {
    throw 'Subscription month in days must be a number';
  }
  if (subscriptionPrice <= 0) {
    throw 'Subscription duration in months cannot be less than or equal to 0';
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
      subscriptionLengthInMonths
    };
  };

if (createGroupForm) { 
        createGroupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.hidden = true;
        let validForm;
        try {
          validForm = await createGroupFormValidation(groupName.value, category.value, platformName.value, groupLimit.value, duePaymentDate.value, platformEmail.value, platformPassword.value, subscriptionPrice.value, subscriptionLengthInMonths.value);
        }
        catch(e) {
          error.hidden = false;
          error.innerHTML = e;
          return;
        }
        event.target.submit();
    });

}