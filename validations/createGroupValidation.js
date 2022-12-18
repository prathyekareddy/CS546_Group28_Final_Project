const { ObjectId } = require("mongodb");
const helper = require("./helper");
var emailValidator = require("email-validator");

const checkId = async (id) => {
  if (!id) throw `Error: You must provide a ID`;
  if (typeof id !== "string") throw `Error:ID must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ID cannot be an empty string or just spaces`;
  if (!ObjectId.isValid(id)) throw `Error: ID invalid object ID`;
  return id;
};

// const checkCreateGroup = async (
//   groupName,
//   // profileImgUrl,
//   platFormName,
//   groupdLeaderId,
//   groupLimit,
//   // memberIds,
//   duePaymentDate,
//   loginId,
//   password,
//   subscriptionLengthInDays
// ) => {
//   //   PlatformName validation remaining???????????????????????????????

//   // Group Name Validation===================================================================================

//   if (!groupName) throw `Error: You must supply GroupName!`;
//   groupName = groupName.trim();
//   if (groupName.length === 0)
//     throw "Group Name cannot be an empty string or string with just spaces";
//   let groupNameReg = new RegExp("^[a-zA-Z0-9]*$");
//   let groupNameReg2 = new RegExp("^[0-9]*$");
//   if (!groupName.match(groupNameReg) && !groupName.match(groupNameReg2))
//     throw new Error("Group Name can only be Alphanumerical");
//   groupName = groupName.trim();
//   if (groupName.length === 0)
//     throw `Group Name cannot be an empty string or string with just spaces`;

//   // Group Leader ID===========================================================================================

//   groupdLeaderId = checkId(groupdLeaderId);

//   // Group Limit ID============================================================================================
//   if (!groupLimit) throw "You should provide a groupLimit Number";

//   if (groupLimit.includes(".")) throw `Error: Decimals values are not allowed`;
//   groupLimit = groupLimit.trim();
//   if (groupLimit.length === 0)
//     throw "Group Limit cannot be an empty string or string with just spaces";
//   groupLimit = Number(groupLimit);
//   if (typeof groupLimit != "number" || Number.isNaN(groupLimit))
//     throw "Group Limit should be an Integer Value";
//   if (groupLimit <= 0) throw `groupLimit can not be less than 1`;

//   // Due Payment Date============================================================================================

//   const date = new Date();
//   if (duePaymentDate.length !== 10)
//     throw "Date must be in the mm/dd/yyyy format";
//   if (duePaymentDate.slice(2, 3) !== "/" || duePaymentDate.slice(5, 6) !== "/")
//     throw `Date must be in the mm/dd/yyyy format`;
//   let currMonth = date.toLocaleDateString().slice(0, 2);
//   let currDay = date.toLocaleDateString().slice(-7, -5);
//   let currYear = date.toLocaleDateString().slice(-4);


//   let dueMonth = Number(duePaymentDate.slice(0, 2));
//   let dueDay = Number(duePaymentDate.slice(3, 5));
//   let dueYear = Number(duePaymentDate.slice(6));

//   if (Number.isNaN(dueMonth) || Number.isNaN(dueDay) || Number.isNaN(dueYear))
//     throw `day, month and year must be numbers`;

//   if (dueMonth < 1 || dueMonth > 12) throw `Month must be between 1-12`;
//   if (dueDay < 1 || dueDay > 31) throw `Day must be between 1-31`;
//   if (dueMonth === 2 && dueDay > 28)
//     throw `February can not contain more than 28 days`;
//   if (dueMonth === 4 || dueMonth === 6 || dueMonth === 9 || dueMonth === 11) {
//     if (dueDay > 30) throw `Date can not be 31 for the month ${dueDay}`;
//   }

//   if (dueYear < currYear) throw `Year should not be less than current year`;


//   if (dueYear == currYear) {
//     if (dueMonth < currMonth)
//       throw `DuePayment Date cannot be less than current date`;
//   }

//   if (dueMonth == currMonth) {
//     if (dueYear == currYear && dueDay < currDay)
//       throw `DuePayment Date cannot be less than current date`;
//   }

//   // LoginID validation======================================================================================

//   if (!loginId) throw `You must supply a Login ID`;
//   loginId = loginId.trim();
//   if (loginId.length === 0)
//     throw `Login Id cannot be an empty string or string with just spaces`;
//   let loginIdReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//   if (!loginId.match(loginIdReg)) throw "Login Id should be a proper mail Id";

//   // Password Validation========================================================================================

//   if (!password) throw `You must provide the password`;
//   password = password.trim();
//   if (password.length === 0)
//     throw `Group Name cannot be an empty string or string with just spaces`;

//   //  subscriptionLengthInDays validation=======================================================================

//   if (subscriptionLengthInDays.includes("."))
//     throw `Error: Decimals values are not allowed`;
//   if (subscriptionLengthInDays.includes("-")) throw `Days should be valid`;
//   if (!subscriptionLengthInDays) throw `You must provide the password`;
//   subscriptionLengthInDays = subscriptionLengthInDays.trim();
//   if (!subscriptionLengthInDays)
//     throw `You must provide the Subscription Duration`;
//   subscriptionLengthInDays = subscriptionLengthInDays.trim();
//   subscriptionLengthInDays = Number(subscriptionLengthInDays);
//   if (
//     typeof subscriptionLengthInDays != "number" ||
//     Number.isNaN(subscriptionLengthInDays)
//   )
//     throw "subscriptionLengthInDays should be a number";

//   return {
//     groupName,
//     // profileImgUrl,
//     platFormName,
//     groupdLeaderId,
//     groupLimit,
//     duePaymentDate,
//     loginId,
//     password,
//     subscriptionLengthInDays
//   };
// };

function checkCreateGroup(groupName, category, platformName, platformEmail,
  platformPassword, groupLimit, dueDate, totalSubsPrice, subsLength, hashTag) {

  //Group Name Validation
  let errorBag = {};
  let isValidGroupNameString = helper.isStringValid('groupName', groupName);
  if (!isValidGroupNameString.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid group Name!";
    errorBag.groupName = "group Name is required!"
    return errorBag;
  }

  let isValidGroupNameAlphaNume = helper.isAlphanumericValid('groupName', groupName);
  if (!isValidGroupNameAlphaNume.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid group Name!";
    errorBag.groupName = "Only alphanumeric characters are allowed in group Name!";
    return errorBag;
  }

  //Category Validation
  let isValidCategory = helper.isStringValid('category', category);
  if (!isValidCategory.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid category!";
    errorBag.category = "category is required!"
    return errorBag;
  }

  let categoryList = ["OTT", "Education", "E-commerce", "Network Carrier Plans"];
  if (!categoryList.includes(category)) {
    errorBag.error = true;
    errorBag.message = "Invalid category!";
    errorBag.category = "Allowed categories are " + categoryList;
    return errorBag;
  }

  //Group Limit Validation
  let isValidGroupLimit = helper.isStringValid('groupLimit', groupLimit);
  if (!isValidGroupLimit.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid group Limit!";
    errorBag.groupLimit = "group Limit is required!"
    return errorBag;
  }
  isValidGroupLimit = helper.isValidInteger('groupLimit', groupLimit);
  if (!isValidGroupLimit.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid group Limit!";
    errorBag.groupLimit = "group Limit should be an interger and greater than zero!"
    return errorBag;
  }

  let groupLimitIntValue = parseInt(groupLimit);
  if (groupLimitIntValue <= 0) {
    errorBag.error = true;
    errorBag.message = "Invalid group Limit!";
    errorBag.groupLimit = "group Limit should be more than zero!"
    return errorBag;
  }

  //PlatformName validation
  let isValidPlatformName = helper.isStringValid('Platform', platformName);
  if (!isValidPlatformName.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid Platform!";
    errorBag.platformName = "Platform is required!"
    return errorBag;
  }

  isValidPlatformName = helper.isAlphanumericValid('Platform', platformName);
  if (!isValidPlatformName.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid Platform name!";
    errorBag.platformName = "Only alphanumeric characters are allowed in Platform name!"
    return errorBag;
  }

  //platformEmail validation
  let isValidplatformEmail = helper.isStringValid('Email', platformEmail);
  if (!isValidplatformEmail.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid Email!";
    errorBag.platformEmail = "Email is required!"
    return errorBag;
  }

  if (!emailValidator.validate(platformEmail)) {
    errorBag.error = true;
    errorBag.message = "Invalid email!";
    errorBag.platformEmail = "Invalid email format!"
    return errorBag;
  }

  // platformPassword Validation
  let isValidplatformPassword = helper.isStringValid('Password', platformPassword);
  if (!isValidplatformPassword.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid password!";
    errorBag.password = "password is required!"
    return errorBag;
  }

  if (platformPassword.trim().length < 6) {
    errorBag.error = true;
    errorBag.message = "Invalid password!";
    errorBag.password = "password should contains at least six characters"
    return errorBag;
  }

  isValidplatformPassword = helper.passwordContainsAtleastOneUpperCaseChar(platformPassword);
  if (!isValidplatformPassword.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid password!";
    errorBag.password = "There needs to be at least one uppercase character, at least one number and at least one special character in password!"
    return errorBag;
  }

  isValidplatformPassword = helper.passwordContainsAtLeastOneNumber(platformPassword);
  if (!isValidplatformPassword.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid password!";
    errorBag.password = "There needs to be at least one uppercase character, at least one number and at least one special character in password!"
    return errorBag;
  }

  isValidplatformPassword = helper.passwordContainsAtLeastOneSpeciChar(platformPassword);
  if (!isValidplatformPassword.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid password!";
    errorBag.password = "There needs to be at least one uppercase character, at least one number and at least one special character in password!"
    return errorBag;
  }

  // Due Payment Date
  const date = new Date();
  if (dueDate.length !== 10) {
    errorBag.error = true;
    errorBag.message = "Invalid due Date!";
    errorBag.dueDate = "dueDate must be in the mm/dd/yyyy format!"
    return errorBag;
  }
  if (dueDate.slice(2, 3) !== "/" || dueDate.slice(5, 6) !== "/") {
    errorBag.error = true;
    errorBag.message = "Invalid due Date!";
    errorBag.dueDate = "dueDate must be in the mm/dd/yyyy format!"
    return errorBag;
  }

  let currMonth = date.toLocaleDateString().slice(0, 2);
  let currDay = date.toLocaleDateString().slice(-7, -5);
  let currYear = date.toLocaleDateString().slice(-4);


  let dueMonth = Number(dueDate.slice(0, 2));
  let dueDay = Number(dueDate.slice(3, 5));
  let dueYear = Number(dueDate.slice(6));

  if (Number.isNaN(dueMonth) || Number.isNaN(dueDay) || Number.isNaN(dueYear)) {
    errorBag.error = true;
    errorBag.message = "Invalid due Date!";
    errorBag.dueDate = `day, month and year must be numbers`;
    return errorBag;
  }

  if (dueMonth < 1 || dueMonth > 12) {
    errorBag.error = true;
    errorBag.message = "Invalid due Date!";
    errorBag.dueDate = `Month must be between 1-12`;
    return errorBag;
  }

  if (dueDay < 1 || dueDay > 31) {
    errorBag.error = true;
    errorBag.message = "Invalid due Date!";
    errorBag.dueDate = `Day must be between 1-31`;
    return errorBag;
  }

  if (dueMonth === 2 && dueDay > 28 && !helper.checkLeapYear(dueYear)) {
    errorBag.error = true;
    errorBag.message = "Invalid dueDate!";
    errorBag.dueDate = `February can not contain more than 28 days`;
    return errorBag;
  }

  if (dueMonth === 2 && dueDay > 29 && helper.checkLeapYear(dueYear)) {
    errorBag.error = true;
    errorBag.message = "Invalid dueDate!";
    errorBag.dueDate = `February can not contain more than 29 days`;
    return errorBag;
  }

  if (dueMonth === 4 || dueMonth === 6 || dueMonth === 9 || dueMonth === 11) {
    if (dueDay > 30) {
      errorBag.error = true;
      errorBag.message = "Invalid dueDate!";
      errorBag.dueDate = `Date can not be 31 for the month ${dueMonth}`;
      return errorBag;
    }
  }

  if (dueYear < currYear) {
    errorBag.error = true;
    errorBag.message = "Invalid due Date!";
    errorBag.dueDate = `Year should not be in the past`;
    return errorBag;
  }


  if (dueYear == currYear) {
    if (dueMonth < currMonth) {
      errorBag.error = true;
      errorBag.message = "Invalid due Date!";
      errorBag.dueDate = `dueDate cannot be before than current date`;
      return errorBag;
    }
  }

  if (dueMonth == currMonth) {
    if (dueYear == currYear && dueDay < currDay) {
      errorBag.error = true;
      errorBag.message = "Invalid due Date!";
      errorBag.dueDate = `due Date cannot be before than current date`;
      return errorBag;
    }
  }

  // totalSubsPrice Validation 
  let isValidTotalSubsPriceString = helper.isStringValid('totalSubscriptionPrice', totalSubsPrice);
  if (!isValidTotalSubsPriceString.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid total Subscription Price!";
    errorBag.subsLength = "total Subscription Price is required!"
    return errorBag;
  }
 
 
  if (totalSubsPrice) {
    if (!helper.isDecimal(totalSubsPrice)) {
      errorBag.error = true;
      errorBag.message = "Invalid total Subscription Price!";
      errorBag.totalSubsPrice = "total Subscription Price should be either an integer or a decimal value!"
      return errorBag;
    }
  }


  // subsLength Validation
  let isValidSubsLengthString = helper.isStringValid('SubscriptionPaymentPlanInMonths', subsLength);
  if (!isValidSubsLengthString.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid Subscription Payment Plan In Months!";
    errorBag.subsLength = "Subscription Payment Plan In Months is required!"
    return errorBag;
  }

  isValidSubsLengthString = helper.isValidInteger('SubscriptionPaymentPlanInMonths', subsLength);
  if (!isValidSubsLengthString.isValid) {
    errorBag.error = true;
    errorBag.message = "Invalid Subscription Payment Plan In Months!";
    errorBag.subsLength = "Subscription Payment Plan In Months should be an interger and greater than zero!"
    return errorBag;
  }

  //Hashtag validation
  if (hashTag) {
    if (hashTag.trim().length !== 0) {
      let hashTagReg = new RegExp(
        "^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$"
      );
      if (!hashTag.match(hashTagReg)) {
        errorBag.error = true;
        errorBag.message = "Hashtag should be an alphanumeric value!";
        errorBag.hashTag = "Hashtag should be an alphanumeric value!"
        return errorBag;
      }
    }
  }
  errorBag.error = false;
  return errorBag;

};


module.exports = {
  checkCreateGroup,
  checkId,
};
