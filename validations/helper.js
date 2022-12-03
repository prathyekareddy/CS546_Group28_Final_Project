// const { ObjectId } = require("mongodb");

// const registerUserValidation = (password,
//     firstName,
//     lastName,
//     email,
//     gender,
//     userDescription,
//     profileImgUrl,
//     address,
//     city,
//     state,
//     streetAddress,
//     phoneNumber) =>{
    
// }

const {ObjectId} = require('mongodb');

const checkSearch = async (groupName, category) => {

  if(!groupName && !category) throw `Error: Enter group name or category to search`;

  if(groupName) {
    if(groupName.trim().length === 0){
        throw `Error: Group Name Can not contain empty spaces`;
    }
  }

  if(category){
      let categoryArray = ["N/A","OTT","Music Streaming","Network Service Providers","Education","E-Commerce","Other"]
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
  checkSearch,
  createUserValidation(firstName,lastName,password,phoneNumber){   
          // firstName validation
          if(firstName.trim().length<3){ throw "First Name should be atleast of length 3"}
          if(firstName.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "First Name should be alphanumeric"} 
          // lastName validation
          if(lastName.trim().length<2){ throw "Last Name should be atleast of length 2"}
          if(lastName.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "Last Name should be alphanumeric"}
          //password validation
          if(password.trim().length<6){ throw "Password should be atleast of length 6"}
          if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
          if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
          if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
          // phoneNumber validation
          if (!phoneNumber) throw `Error: You must supply a ${varName}!`;
          if (typeof phoneNumber !== 'string') throw `Error: ${varName} must be a string!`;
          phoneNumber = strVal.trim();
          if (phoneNumber.length === 0)
            throw `Error: ${varName} cannot be an empty string or string with just spaces`;
          if(phoneNumber.trim().length!=10){ throw "Phone Number should be 10 numbers"}
          if(phoneNumber.trim().search(/[^0-9]/g)!=-1){throw "Phone Number should be only numbers"}
  },
  checkUserValidation(emailId,password){
    // emailId validation
    if(emailId.trim().length<4){ throw "emailId should be atleast of length 4"}
    if(emailId.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "emailId should be alphanumeric"}
    //password validation
    if(password.trim().length<6){ throw "Password should be atleast of length 4"}
    if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
    if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
    if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
  }
};
 