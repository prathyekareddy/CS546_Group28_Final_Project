let cgForm = document.getElementById('cgForm');
let groupName = document.getElementById('group-name');
let platformName = document.getElementById('platform-name');
let groupLimit = document.getElementById('group-limit');
let category = document.getElementById('category');
let duePaymentDate = document.getElementById('due-date');
let subscriptionLengthInDays = document.getElementById('subs-length');
let loginId = 'sabah@gmail.com';
let password = 'Password';
let error = document.getElementById('error');
  
  const checkCreateGroup = async (
    groupName,
    // profileImgUrl,
    platformName,
    groupLimit,
    // memberIds,
    duePaymentDate,
    loginId,
    password,
    subscriptionLengthInDays
  ) => {
    //   PlatformName validation remaining???????????????????????????????
  
    // Group Name Validation===================================================================================
  
    if (!groupName) {
      throw `Error: You must supply GroupName!`;
    } 
    groupName = groupName.trim();
    if (groupName.length === 0)
      throw "Group Name cannot be an empty string or string with just spaces";
    let groupNameReg = new RegExp("^[a-zA-Z0-9]*$");
    let groupNameReg2 = new RegExp("^[0-9]*$");
    if (!groupName.match(groupNameReg) && !groupName.match(groupNameReg2))
      throw new Error("Group Name can only be Alphanumerical");
    groupName = groupName.trim();
    if (groupName.length === 0)
      throw `Group Name cannot be an empty string or string with just spaces`;

    if (!platformName) {
      throw 'You should provide a Platform name';
    }
    platformName = platformName.trim();
    if (platformName.length === 0)
    throw `Platform Name cannot be an empty string or string with just spaces`;
  
    // Group Limit ID============================================================================================
    if (!groupLimit) throw "You should provide a groupLimit Number";
  
    if (groupLimit.includes(".")) throw `Error: Decimals values are not allowed`;
    groupLimit = groupLimit.trim();
    if (groupLimit.length === 0)
      throw "Group Limit cannot be an empty string or string with just spaces";
    groupLimit = Number(groupLimit);
    if (typeof groupLimit != "number" || Number.isNaN(groupLimit))
      throw "Group Limit should be an Integer Value";
    if (groupLimit <= 0) throw `groupLimit can not be less than 1`;
  
    // Due Payment Date============================================================================================
  
    const date = new Date();
    if (duePaymentDate.length !== 10)
      throw "Date must be in the mm/dd/yyyy format";
    if (duePaymentDate.slice(2, 3) !== "/" || duePaymentDate.slice(5, 6) !== "/")
      throw `Date must be in the mm/dd/yyyy format`;
    let currMonth = date.toLocaleDateString().slice(0, 2);
    let currDay = date.toLocaleDateString().slice(-7, -5);
    let currYear = date.toLocaleDateString().slice(-4);
  
  
    let dueMonth = Number(duePaymentDate.slice(0, 2));
    let dueDay = Number(duePaymentDate.slice(3, 5));
    let dueYear = Number(duePaymentDate.slice(6));
  
    if (Number.isNaN(dueMonth) || Number.isNaN(dueDay) || Number.isNaN(dueYear))
      throw `day, month and year must be numbers`;
  
    if (dueMonth < 1 || dueMonth > 12) throw `Month must be between 1-12`;
    if (dueDay < 1 || dueDay > 31) throw `Day must be between 1-31`;
    if (dueMonth === 2 && dueDay > 28)
      throw `February can not contain more than 28 days`;
    if (dueMonth === 4 || dueMonth === 6 || dueMonth === 9 || dueMonth === 11) {
      if (dueDay > 30) throw `Date can not be 31 for the month ${dueDay}`;
    }
  
    if (dueYear < currYear) throw `Year should not be less than current year`;
  
  
    if (dueYear == currYear) {
      if (dueMonth < currMonth)
        throw `DuePayment Date cannot be less than current date`;
    }
  
    if (dueMonth == currMonth) {
      if (dueYear == currYear && dueDay < currDay)
        throw `DuePayment Date cannot be less than current date`;
    }
  
    // LoginID validation======================================================================================
  
    if (!loginId) throw `You must supply a Login ID`;
    loginId = loginId.trim();
    if (loginId.length === 0)
      throw `Login Id cannot be an empty string or string with just spaces`;
    let loginIdReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!loginId.match(loginIdReg)) throw "Login Id should be a proper mail Id";
  
    // Password Validation========================================================================================
  
    if (!password) throw `You must provide the password`;
    password = password.trim();
    if (password.length === 0)
      throw `Group Name cannot be an empty string or string with just spaces`;
  
    //  subscriptionLengthInDays validation=======================================================================
  
    if (subscriptionLengthInDays.includes("."))
      throw `Error: Decimals values are not allowed`;
    if (subscriptionLengthInDays.includes("-")) throw `Days should be valid`;
    if (!subscriptionLengthInDays) throw `You must provide the subscription length in days`;
    subscriptionLengthInDays = subscriptionLengthInDays.trim();
    if (!subscriptionLengthInDays)
      throw `You must provide the Subscription Duration`;
    subscriptionLengthInDays = subscriptionLengthInDays.trim();
    subscriptionLengthInDays = Number(subscriptionLengthInDays);
    if (
      typeof subscriptionLengthInDays != "number" ||
      Number.isNaN(subscriptionLengthInDays)
    )
      throw "subscriptionLengthInDays should be a number";
    
    
  
    return {
      groupName,
      // profileImgUrl,
      platformName,
      groupLimit,
      // memberIds,
      duePaymentDate,
      loginId,
      password,
      subscriptionLengthInDays
    };
  };
// let groupImage = document.getElementById('group-image');

if (cgForm) { 
        cgForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.hidden = true;
        let validForm;
        try {
            validForm = await checkCreateGroup(groupName.value, platformName.value, groupLimit.value, duePaymentDate.value, loginId, password, subscriptionLengthInDays.value);
        }
        catch(e) {
            error.hidden = false;
            error.innerHTML = e;
            return;
        }
        event.target.submit();
    });

}