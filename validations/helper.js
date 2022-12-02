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
  checkSearch
};
