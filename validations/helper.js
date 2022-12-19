const {ObjectId} = require('mongodb');

function editUserValidation(
  emailId,
  firstName,
  lastName,
  phoneNumber,
  ott,
  musicStreaming,
  networkServiceProviders,
  education,
  eCommerce,
  other,
  gender
) {
  // Email-id Validation
  if (emailId.trim().length < 4) {
    throw "Enter a valid length email-id";
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailId.trim())) {
    throw "Enter a valid email-id";
  }
  // firstName validation
  if (firstName.trim().length < 3) {
    throw "First Name should be atleast of length 3";
  }
  if (firstName.trim().search(/[^a-zA-Z0-9]/g) != -1) {
    throw "First Name should be alphanumeric";
  }
  // lastName validation
  if (lastName.trim().length < 2) {
    throw "Last Name should be atleast of length 2";
  }
  if (lastName.trim().search(/[^a-zA-Z0-9]/g) != -1) {
    throw "Last Name should be alphanumeric";
  }
  // phoneNumber validation
  if (!phoneNumber) throw `Error: You must supply a phoneNumber!`;
  if (typeof phoneNumber !== "string")
    throw `Error: phoneNumber must be a string!`;
  phoneNumber = phoneNumber.trim();
  if (phoneNumber.length === 0)
    throw `Error: phoneNumber cannot be an empty string or string with just spaces`;
  if (phoneNumber.trim().length != 10) {
    throw "Phone Number should be 10 numbers";
  }
  if (phoneNumber.trim().search(/[^0-9]/g) != -1) {
    throw "Phone Number should be only numbers";
  }
  // Gender Validation
  let validGenderList = ["Male", "Female", "Other"];
  let validGender = false;
  for (let i in validGenderList) {
    if (validGenderList[i] == gender) {
      validGender = true;
      break;
    }
  }
  if (validGender == false) {
    throw "Select a valid gender";
  }
  //interestedIn validation
  if (ott) {
    if (ott != "OTT") {
      throw "Select valid OTT choice from checkbox for Interested-in categories";
    }
  }
  if (musicStreaming) {
    if (musicStreaming != "Music Streaming") {
      throw "Select valid Music Streaming choice from checkbox for Interested-in categories";
    }
  }
  if (networkServiceProviders) {
    if (networkServiceProviders != "Network Service Providers") {
      throw "Select valid Network Service Providers choice from checkbox for Interested-in categories";
    }
  }
  if (education) {
    if (education != "Education") {
      throw "Select valid Education choice from checkbox for Interested-in categories";
    }
  }
  if (eCommerce) {
    if (eCommerce != "E-Commerce") {
      throw "Select valid E-Commerce choice from checkbox for Interested-in categories";
    }
  }
  if (other) {
    if (other != "Other") {
      throw "Select valid Other choice from checkbox for Interested-in categories";
    }
  }
}

function createUserValidation(
  emailId,
  firstName,
  lastName,
  password,
  rePassword,
  phoneNumber,
  ott,
  musicStreaming,
  networkServiceProviders,
  education,
  eCommerce,
  other,
  gender
) {
  // Email-id Validation
  if (emailId.trim().length < 4) {
    throw "Enter a valid length email-id";
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailId.trim())) {
    throw "Enter a valid email-id";
  }
  // firstName validation
  if (firstName.trim().length < 3) {
    throw "First Name should be atleast of length 3";
  }
  // if (firstName.trim().search(/[^a-zA-Z0-9]/g) != -1) {
  //   throw "First Name should be alphanumeric";
  // }
  // lastName validation
  if (lastName.trim().length < 2) {
    throw "Last Name should be atleast of length 2";
  }
  // if (lastName.trim().search(/[^a-zA-Z0-9]/g) != -1) {
  //   throw "Last Name should be alphanumeric";
  // }
  //password validation
  if (password.trim().length < 6) {
    throw "Password should be atleast of length 6";
  }
  if (password.trim().search(/[A-Z]/g) == -1) {
    throw "Password should contain atleast 1 uppercase character, 1 number and 1 special character";
  }
  if (password.trim().search(/[0-9]/g) == -1) {
    throw "Password should contain atleast 1 uppercase character, 1 number and 1 special character";
  }
  if (password.trim().search(/[^A-Za-z0-9]/g) == -1) {
    throw "Password should contain atleast 1 uppercase character, 1 number and 1 special character";
  }
  // Re-Password Validation
  if (rePassword.trim() != password.trim()) {
    throw "Re-entered pasword should match initial password";
  }
  // phoneNumber validation
  if (!phoneNumber) throw `Error: You must supply a phoneNumber!`;
  if (typeof phoneNumber !== "string")
    throw `Error: phoneNumber must be a string!`;
  phoneNumber = phoneNumber.trim();
  if (phoneNumber.length === 0)
    throw `Error: phoneNumber cannot be an empty string or string with just spaces`;
  if (phoneNumber.trim().length != 10) {
    throw "Phone Number should be 10 numbers";
  }
  if (phoneNumber.trim().search(/[^0-9]/g) != -1) {
    throw "Phone Number should be only numbers";
  }
  // Gender Validation
  let validGenderList = ["Male", "Female", "Other"];
  let validGender = false;
  for (let i in validGenderList) {
    if (validGenderList[i] == gender) {
      validGender = true;
      break;
    }
  }
  if (validGender == false) {
    throw "Select a valid gender";
  }
  //interestedIn validation
  if (ott) {
    if (ott != "OTT") {
      throw "Select valid OTT choice from checkbox for Interested-in categories";
    }
  }
  if (musicStreaming) {
    if (musicStreaming != "Music Streaming") {
      throw "Select valid Music Streaming choice from checkbox for Interested-in categories";
    }
  }
  if (networkServiceProviders) {
    if (networkServiceProviders != "Network Service Providers") {
      throw "Select valid Network Service Providers choice from checkbox for Interested-in categories";
    }
  }
  if (education) {
    if (education != "Education") {
      throw "Select valid Education choice from checkbox for Interested-in categories";
    }
  }
  if (eCommerce) {
    if (eCommerce != "E-Commerce") {
      throw "Select valid E-Commerce choice from checkbox for Interested-in categories";
    }
  }
  if (other) {
    if (other != "Other") {
      throw "Select valid Other choice from checkbox for Interested-in categories";
    }
  }
}

const checkSearch = async (groupName, category) => {

  if(!groupName && !category) throw `Error: Enter group name or category to search`;

  if(groupName) {
    if(groupName.trim().length === 0){
        throw `Error: Group Name Can not contain empty spaces`;
    }
  }

  if(category){
      let categoryArray = ["N/A","OTT","Music Streaming","Network Service Provider","Education","E-Commerce","Other"]
      if(category) {
          if(category.trim().length === 0){
              throw `Error: Category Can not contain empty spaces`;
          }
          let flag = true;
          categoryArray.forEach(element => {
              if(category === element) flag = false;
          });
          if(flag) {
              throw `Error: Invalid Category`;
          }
      }
  }
}


/**
 * Sabah
 * Validate String
 */

 function isStringValid(keyName, input) {

  let validationDetails = {};
  if (!input) {
      validationDetails.isValid = false;
      validationDetails.message = `Input=${input} is invalid for key=${keyName}`;
  } else if (!(typeof input === 'string')) {
      validationDetails.isValid = false;
      validationDetails.message = `Input=${input} is not a string for key=${keyName}`;
  } else if (input.trim().length <= 0) {
      validationDetails.isValid = false;
      validationDetails.message = `Input=${input} is empty string for key=${keyName}`;
  } else {
      validationDetails.isValid = true;
      validationDetails.message = `Input=${input} is valid string for key=${keyName}`;
  }

  return validationDetails;
}

/**
 * Sabah
 * Validate Alphanumeric
 */
function isAlphanumericValid(keyName, input) {
  input = input.trim();
  let regularExp = /^[a-zA-Z0-9]+$/;
  let validationDetails = {};
  if (input.match(regularExp)) {
      validationDetails.isValid = true;
      validationDetails.message = `Input=${input} is valid alphanumeric for key=${keyName}`;
  } else {
      validationDetails.isValid = false;
      validationDetails.message = `Input=${input} is not valid alphanumeric for key=${keyName}`;
  }
  return validationDetails;
}


/**
 * Sabah
 * Validate password contains at least one upper case char
 */
function passwordContainsAtleastOneUpperCaseChar(input) {
  input = input.trim();
  let regularExp = /([A-Z])+/;
  let validationDetails = {};
  if (input.match(regularExp)) {
      validationDetails.isValid = true;
      validationDetails.message = `Password=${input} contanis at least on uppercase character!`;
  } else {
      validationDetails.isValid = false;
      validationDetails.message = `Password=${input} doesn't contani at least on uppercase character!`;
  }
  return validationDetails;
}

/**
 * Sabah
 * @param {password} input 
 * @returns 
 */
function passwordContainsAtLeastOneNumber(input) {
  input = input.trim();
  let regularExp = /([0-9])+/;
  let validationDetails = {};
  if (input.match(regularExp)) {
      validationDetails.isValid = true;
      validationDetails.message = `Password=${input} contanis at least one number!`;
  } else {
      validationDetails.isValid = false;
      validationDetails.message = `Password=${input} doesn't contain at least one number!`;
  }
  return validationDetails;
}

/**
 * Sabah
 * @param {password} input 
 * @returns 
 */
function passwordContainsAtLeastOneSpeciChar(input) {
  input = input.trim();
  let regularExp = /([-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#])+/;
  let validationDetails = {};
  if (input.match(regularExp)) {
      validationDetails.isValid = true;
      validationDetails.message = `Password=${input} contanis at least one speical character!`;
  } else {
      validationDetails.isValid = false;
      validationDetails.message = `Password=${input} doesn't contain at least one special character!`;
  }
  return validationDetails;
}

/**
 * Sabah
 * @param {password} pass 
 * @returns 
 */
async function getBcryptPassword(pass) {
  const bcryptSalt = await bcrypt.genSalt();
  return await bcrypt.hash(pass, bcryptSalt);
}


/**
 * Sabah
 * Integer Validation
 * 
 * @param {input value} integerValue 
 * @param {name of key} keyName 
 * @returns 
 */
 function isValidInteger(keyName,integerValue) {
  integerValue = integerValue.trim();
  const regEx = /^[0-9]+$/;

  let validationDetails = {};
  if (integerValue.match(regEx)) {
    validationDetails.isValid = true;
    validationDetails.message = `Input=${keyName} has valid integer!`;
  }
  else {
    validationDetails.isValid = false;
    validationDetails.message = `Input=${keyName} has not valid integer!`;
  }

  return validationDetails;
}

/**
 * Sabah
 * String Validation By Reg
 * 
 * @param {input value} stringValue 
 * @param {name of key} keyName 
 * @returns 
 */
 function isValidStringByReg(keyName,stringValue) {
  stringValue = stringValue.trim();
  const regEx = /^[a-zA-Z]+$/;

  let validationDetails = {};
  if (stringValue.match(regEx)) {
    validationDetails.isValid = true;
    validationDetails.message = `Input=${keyName} has valid string!`;
  }
  else {
    validationDetails.isValid = false;
    validationDetails.message = `Input=${keyName} has not valid string!`;
  }

  return validationDetails;
}

/**
 * Sabah
 * Decimal Validation By Reg
 * 
 * @param {input value} input 
 * @returns 
 */
function isDecimal(input){
  var RE = /^-{0,1}\d*\.{0,1}\d+$/;
  return (RE.test(input));
}


function checkLeapYear(year) {

  //three conditions to find out the leap year
  if ((0 == year % 4) && (0 != year % 100) || (0 == year % 400)) {
      return true;
  } else {
      return false;
  }
}

function editGroupDetailsValidation(
  groupName,
  category, 
  platformName,
  platformEmail, 
  platformPassword,
  groupLimit) {
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
  }  
}


module.exports = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },
  
  idCheck(id){
    if (!id) throw 'You must provide an id to search for';
    // if (id.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    return id;
  }, 
  checkSearch,
  createUserValidation,
  checkUserValidation(emailId,password){
    // emailId validation
    if(emailId.trim().length<4){ throw "emailId should be atleast of length 4"}
    if(!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(emailId.trim())){ throw "Enter a valid email-id"}
    //password validation
    if(password.trim().length<6){ throw "Password should be atleast of length 4"}
    if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
    if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
    if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
  },
  editUserValidation,
  isStringValid, 
  isAlphanumericValid, 
  passwordContainsAtleastOneUpperCaseChar, 
  passwordContainsAtLeastOneNumber, 
  passwordContainsAtLeastOneSpeciChar, 
  getBcryptPassword,
  isValidInteger,
  isValidStringByReg,
  isDecimal,
  checkLeapYear,
  editGroupDetailsValidation
};
