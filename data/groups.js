const mongoCollections = require("../config/mongo-collections");
const groups = mongoCollections.groups;
const validation = require("../validations/createGroupValidation")
const {ObjectId} = require('mongodb');
const createGroupValidation = require("../validations/createGroupValidation");
const userGroupData = require("./usergroup")
const helper = require("../validations/helper");
const userData = require('./users');
const  groupchat  = require("../data/groupchat");
var emailValidator = require("email-validator");
const e = require("express");

// const createGroup = async (
//   groupName,
//   // profileImgUrl,
//   platFormName,
//   groupdLeaderId,
//   groupLimit,
//   // memberIds,
//   duePaymentDate,
//   loginId,
//   password,
//   subscriptionLengthInDays,
//   category
// ) => {

// //Profile Images and memberIds who joins the grp will have to be updated

//   const grpCollection = await groups();
//   let newObj = {};

//   try {
//     newObj = await createGroupValidation.checkCreateGroup( groupName,
//       // profileImgUrl,
//       platFormName,
//       groupdLeaderId,
//       groupLimit,
//       // memberIds,
//       duePaymentDate,
//       loginId,
//       password,
//       subscriptionLengthInDays)
//       console.log(newObj , "validated");
//   } catch (error) {
//     console.log(error);
//   }
//   console.log(newObj)

//   let newGrp = {
//     groupName:newObj.groupName,
//     profileImgUrl:"",
//     platFormName:newObj.platFormName,
//     groupdLeaderId:newObj.groupdLeaderId,
//     groupLimit:newObj.groupLimit,
//     memberIds:[],
//     duePaymentDate:newObj.duePaymentDate,
//     loginId:newObj.loginId,
//     password:newObj.password,
//     subscriptionLengthInDays:newObj.subscriptionLengthInDays,
//     category:category,
//     requestToJoin:[]
//   };

//   newGrp.memberIds.push(groupdLeaderId);

//   const insertedGrp = await grpCollection.insertOne(newGrp);

//   if (!insertedGrp.acknowledged || !insertedGrp.insertedId)
//     throw "Could not create the group";

// };

const addGroupChatIdToGroup = async (groupId, groupChatId) => {
  groupId = helper.checkId(groupId.toString());
  groupChatId = helper.checkId(groupChatId.toString());

  const grpCollection = await groups();
  let updateGrpDetails = {
    groupChatId: ObjectId(groupChatId)
  };

  const newUpdatedGrp = await grpCollection.updateOne(
    { _id: ObjectId(groupId) },
    { $set: updateGrpDetails }
  );
  if (!newUpdatedGrp.modifiedCount || !newUpdatedGrp.acknowledged) {
    throw "Cannot update List of Users";
  }
  return true;
}

const sendRequest = async (groupId, userId) => {
  groupId = helper.checkId(groupId);
  userId = helper.checkId(userId);
  const grpCollection = await groups();
  const oldGrpData = await getGroupById(groupId);

  oldGrpData.requestToJoin.push(userId);
  let updateGrpDetails = {
    requestToJoin: oldGrpData.requestToJoin
  };

  const newUpdatedGrp = await grpCollection.updateOne(
    { _id: ObjectId(groupId) },
    { $set: updateGrpDetails }
  );
  if (!newUpdatedGrp.modifiedCount || !newUpdatedGrp.acknowledged) {
    throw "Cannot update List of Users";
  }
  return true;
}

const searchGroup = async (input) => {

  try {
    helper.checkSearch(input.groupName, input.category);
  } catch (e) {
    console.log("Error: ", e);
  }

  const listOfGroups = await getAllGroups();
  let result = [];
  if (input.category && input.groupName) {
    let tempResult = []
    listOfGroups.forEach(group => {
      if (group.groupLimit.toString() !== group.listOfUsers.length.toString() && group.category.toLowerCase().includes(input.category.toLowerCase()) 
            && !group.listOfUsers.includes(input.userId)) {
        let newEntry = {
          groupName: group.groupName,
          platform: group.platform.platformName,
          monthlyPayment: group.payment.montlyPaymentForGroup, 
          requested: group.requestToJoin.includes(input.userId), 
          groupId: group._id, 
          groupLimit: group.groupLimit, 
          totalMembers: group.listOfUsers.length, 
          groupImage: group.groupImage
        }
        newEntry.notRequested = !newEntry.requested;
        tempResult.push(newEntry);
      }
    });
    tempResult.forEach(group => {
      if (group.groupName.toLowerCase().includes(input.groupName.toLowerCase()) ) {
        let newEntry = {
          groupName: group.groupName,
          platform: group.platform,
          monthlyPayment: group.monthlyPayment,
          requested: group.requested,
          notRequested: group.notRequested,
          groupId: group.groupId,
          groupLimit: group.groupLimit,
          totalMembers: group.totalMembers,
          groupImage: group.groupImage
        }
        newEntry.yearlyPayment = Number(newEntry.monthlyPayment) * 12;
        result.push(newEntry);
      }
    });
  }
  else if (input.category) {
    listOfGroups.forEach(group => {
      if (group.groupLimit.toString() !== group.listOfUsers.length.toString() && group.category.toLowerCase().includes(input.category.toLowerCase()) && !group.listOfUsers.includes(input.userId)) {
        let newEntry = {
          groupName: group.groupName,
          platform: group.platform.platformName,
          monthlyPayment: group.payment.montlyPaymentForGroup, 
          requested: group.requestToJoin.includes(input.userId), 
          groupId: group._id, 
          groupLimit: group.groupLimit, 
          totalMembers: group.listOfUsers.length, 
          groupImage: group.groupImage
        }
        newEntry.notRequested = !newEntry.requested;
        newEntry.yearlyPayment = Number(newEntry.monthlyPayment) * 12;
        result.push(newEntry);
      }
    });
  }
  else if (input.groupName) {
    listOfGroups.forEach(group => {
      if (group.groupLimit.toString() !== group.listOfUsers.length.toString() && group.groupName.toLowerCase().includes(input.groupName.toLowerCase()) && !group.listOfUsers.includes(input.userId)) {
        let newEntry = {
          groupName: group.groupName,
          platform: group.platform.platformName,
          monthlyPayment: group.payment.montlyPaymentForGroup,
          requested: group.requestToJoin.includes(input.userId),
          groupId: group._id,
          groupLimit: group.groupLimit,
          totalMembers: group.listOfUsers.length,
          groupImage: group.groupImage
        }
        newEntry.notRequested = !newEntry.requested;
        newEntry.yearlyPayment = Number(newEntry.monthlyPayment) * 12;
        result.push(newEntry);
      }
    });
  }
  return result;
}


// Sabah
async function getRequestedUserByGroupLeaderId(groupLeaderId){
  const grpCollection = await groups();
  // let groupCollections= await grpCollection.find({"groupdLeaderId":groupLeaderId}).toArray();
  let groupCollections= await grpCollection.find({"groupLeaderId":groupLeaderId}).toArray();
  return await userData.getAllUsersByUserIdList(groupCollections);
} 

// Sabah
async function udpateReadRequest(readRequestList){
  const grpCollection = await groups();
  for(let group of readRequestList){
    let newUpdatedGrp = await grpCollection.updateOne(
      { _id: ObjectId(group.groupId) },
      { $set: {readRequestToJoin:group.readRequestToJoin} }
    );
  }
  
} 

const createGroup = async (
  userid,
  groupName,
  groupImage,
  category,
  platformName,
  platformLoginId,
  platFormPassword,
  groupLimit,
  duePaymentDate,
  totalPaymentPrice,
  paymentPlanSpanInMonths,
  hashtags
) => {

  helper.checkId(userid);

   // ************************************************* Group Name Validation *****************************************************
   let isValidGroupNameString = helper.isStringValid('groupName', groupName);
   if (!isValidGroupNameString.isValid) {
    throw "groupNamrequired!"
   }
 
  //  let isValidGroupNameAlphaNume = helper.isAlphanumericValid('groupName', groupName);
  //  if (!isValidGroupNameAlphaNume.isValid) {
  //   throw "Only alphanumeric is allowed in groupName!"
  //  }

    // ********************************************* Category Validation ************************************************************
  let isValidCategory = helper.isStringValid('category', category);
  if (!isValidCategory.isValid) {
    throw "category is required!"
  }

  let categoryList = ["OTT", "Music Streaming", "Network Service Providers", "Education", "E-commerce", "Other"];
  if (!categoryList.includes(category)) {
    console.log(category);
    throw "Allowed categories are " + categoryList
  }


 // ********************************************* Group Limit Validation ************************************************************
 let isValidGroupLimit = helper.isStringValid('groupLimit', groupLimit);
 if (!isValidGroupLimit.isValid) {
   throw "groupLimit is required!";
 }

 isValidGroupLimit = helper.isValidInteger('groupLimit', groupLimit);
 if (!isValidGroupLimit.isValid) {
      throw "groupLimit should be interger and more than zero!";
 }

 let groupLimitIntValue = parseInt(groupLimit);
 if (groupLimitIntValue <= 0) {
   throw "groupLimit should be more than zero!"
 }

  // ****************************************** PlatformName validation ************************************************
  let isValidPlatformName = helper.isStringValid('platformName', platformName);
  if (!isValidPlatformName.isValid) {
    throw "platformName is required!"
  }

  // isValidPlatformName = helper.isAlphanumericValid('platformName', platformName);
  // if (!isValidPlatformName.isValid) {
  //   throw "Only alphanumeric are allowed in Platform!"
  // }

  // ****************************************** platformEmail validation ************************************************
  let isValidplatformEmail = helper.isStringValid('platformLoginId', platformLoginId);
  if (!isValidplatformEmail.isValid) {
    throw "platformLoginId is required!"
  }

  if (!emailValidator.validate(platformLoginId)) {
    throw "Invalid email format!"
  }
  
  /*********************************************** platformPassword Validation *********************************************************/
  let isValidplatformPassword = helper.isStringValid('platformPassword', platFormPassword);
  if (!isValidplatformPassword.isValid) {
    throw "password is required!"
  }

  if (platFormPassword.trim().length < 6) {
    throw "password should contains at least six characters"
  }

  isValidplatformPassword = helper.passwordContainsAtleastOneUpperCaseChar(platFormPassword);
  if (!isValidplatformPassword.isValid) {
    throw "There needs to be at least one uppercase character, at least one number and at least one special character in password!"
  }

  isValidplatformPassword = helper.passwordContainsAtLeastOneNumber(platFormPassword);
  if (!isValidplatformPassword.isValid) {
    throw "There needs to be at least one uppercase character, at least one number and at least one special character in password!"
  }

  isValidplatformPassword = helper.passwordContainsAtLeastOneSpeciChar(platFormPassword);
  if (!isValidplatformPassword.isValid) {
    throw "There needs to be at least one uppercase character, at least one number and at least one special character in password!"
  }

   // Due Payment Date============================================================================================
   const date = new Date();
   if (duePaymentDate.length !== 10) {
     throw "duePaymentDate must be in the mm/dd/yyyy format!"
   }
   if (duePaymentDate.slice(2, 3) !== "/" || duePaymentDate.slice(5, 6) !== "/") {
     throw "duePaymentDate must be in the mm/dd/yyyy format!"
   }
 
   let currMonth = date.toLocaleDateString().slice(0, 2);
   let currDay = date.toLocaleDateString().slice(-7, -5);
   let currYear = date.toLocaleDateString().slice(-4);
 
 
   let dueMonth = Number(duePaymentDate.slice(0, 2));
   let dueDay = Number(duePaymentDate.slice(3, 5));
   let dueYear = Number(duePaymentDate.slice(6));
 
   if (Number.isNaN(dueMonth) || Number.isNaN(dueDay) || Number.isNaN(dueYear)) {
      throw `day, month and year must be numbers`;
   }
 
   if (dueMonth < 1 || dueMonth > 12) {
     throw `Month must be between 1-12`;
   }
 
   if (dueDay < 1 || dueDay > 31) {
     throw `Day must be between 1-31`;
   }
 
   if (dueMonth === 2 && dueDay > 28 && !helper.checkLeapYear(dueYear)) {
     throw `February can not contain more than 28 days`;
   }
 
   if (dueMonth === 2 && dueDay > 29 && helper.checkLeapYear(dueYear)) {
    throw `February can not contain more than 29 days`;
  }

   if (dueMonth === 4 || dueMonth === 6 || dueMonth === 9 || dueMonth === 11) {
     if (dueDay > 30) {
       throw `Date can not be 31 for the month ${dueDay}`;
     }
   }
 
   if (dueYear < currYear) {
    throw `Year should not be less than current year`;
   }
 
 
  //  if (dueYear == currYear) {
  //    if (dueMonth < currMonth) {
  //      throw `duePaymentDate cannot be less than current date`;
  //    }
  //  }
 
   if (dueMonth == currMonth) {
     if (dueYear == currYear && dueDay < currDay) {
       throw `duePaymentDate cannot be less than current date`;
     }
   }

   /************************************************* totalPaymentPrice Validation ***********************************************/
   let isValidTotalPaymentPrice = helper.isStringValid('totalPaymentPrice', totalPaymentPrice);
   if (isValidTotalPaymentPrice.isValid) {
    if (!helper.isDecimal(totalPaymentPrice)) {
      throw "totalPaymentPrice should be either integer or decimal!"
  }  
   }
   
   
 
   // ********************************************* paymentPlanSpanInMonths Validation ************************************************************
   let isValidSubsLengthString = helper.isStringValid('paymentPlanSpanInMonths', paymentPlanSpanInMonths);
   if (!isValidSubsLengthString.isValid) {
     throw "paymentPlanSpanInMonths is required!"
   }
 
   isValidSubsLengthString = helper.isValidInteger('paymentPlanSpanInMonths', paymentPlanSpanInMonths);
   if (!isValidSubsLengthString.isValid) {
     throw "paymentPlanSpanInMonths should be interger and more than zero!"
   }

   platformLoginId=platformLoginId.toLowerCase()

   const grpCollection = await groups();
  // Checking existing email
  const userOne = await grpCollection.findOne({ "platform.platformLoginId":platformLoginId});
  // if (userOne) {
  //   throw `There is already a group with that email`;
  // }
  //Profile Images and memberIds who joins the grp will have to be updated

  montlyPaymentForGroup =await monthlyPaymentCalculator(totalPaymentPrice,paymentPlanSpanInMonths)

  let hashtagArr = []
  if(hashtags){
    hashtagArr = hashtags.split("#");
    hashtagArr = hashtagArr.filter(element => {
      return element !== '';
    });
  }
  
  let newGrp = {
    groupName:groupName,
    groupImage:groupImage,
    category:category,
    platform:{
      platformName:platformName,
      platformLoginId: platformLoginId,
      platformPassword:platFormPassword
    },
    groupLeaderId:userid,
    groupLimit:groupLimit,
    duePaymentDate:duePaymentDate,
    payment:{
      totalPaymentPrice:totalPaymentPrice, //"54$"
      paymentPlanSpanInMonths:paymentPlanSpanInMonths, // 6
      montlyPaymentForGroup: montlyPaymentForGroup
    },
    listOfUsers:[userid],//userId list
    requestToJoin: [],
    hashtags:hashtagArr,
    readRequestToJoin:[],
    reports:[]
  };
  const insertedGrp = await grpCollection.insertOne(newGrp);

  if (!insertedGrp.acknowledged || !insertedGrp.insertedId)
    throw "Could not create the group";
  const insertedGrpId = insertedGrp.insertedId.toString();
  const group = await getGroupById(insertedGrpId);

  await userData.addGroupToUser(userid, insertedGrpId);
  let groupChatCreated;
  try{
    groupChatCreated = await groupchat.createGroupChat(insertedGrpId)
  }catch(e){
    console.log("Group chat Creating unsuccessful",e)
    return;
  }
  
  await addGroupChatIdToGroup(insertedGrpId,groupChatCreated._id);


  if(userid){
    await userGroupData.createUserGroup(userid,insertedGrpId,montlyPaymentForGroup)
  }

  return group;
};

 async function monthlyPaymentCalculator(totalPaymentPrice,paymentPlanSpanInMonths){
  if(paymentPlanSpanInMonths && totalPaymentPrice){
    const monthlyPayment = totalPaymentPrice/paymentPlanSpanInMonths;
    return monthlyPayment
  }else{
    return 0
  }

};

const addReportToGroup = async (groupid,reportedUserId, userid) => {
  const grpCollection = await groups();
  try{
    reportingUser = await userData.getUserById(userid)
  } catch (e){
    console.log(e + "Error finding reportingUser in addReportToGroup")
  }
  try{
    reportedUser = await userData.getUserById(reportedUserId)
  } catch (e){
    console.log(e + "Error finding reportedUser in addReportToGroup")
  }
  const currentTime = new Date();
  if(reportingUser && reportedUser){
    console.log("found both")
    messageData = {
      message:reportingUser.firstName + " " + reportingUser.lastName + " has reported " + reportedUser.firstName + " " + reportedUser.lastName + ".",
      time:  currentTime.toLocaleString()
    }

    const reportUserList = await grpCollection.updateOne({ _id:  ObjectId(groupid) },
    {$push: { 'reports': messageData }});
    if (!reportUserList.acknowledged){
      throw `removing requestToJoin Failed`
    }
    return true
  }
  return false
}

const getAllGroups = async () => {
  const grpCollection = await groups();
  return await grpCollection.find({}).toArray();
};

const getGroupById = async (groupId) => {
  // groupId = validation.checkId(groupId, "id");
  const grpCollection = await groups();
  const grp = await grpCollection.findOne({ _id: ObjectId(groupId) });
  if (!grp) throw "Group not found";
  return grp;
};

const removeGroup = async (groupId) => {
  groupId = validation.checkId(groupId, "id");
  const grpCollection = await groups();
  const deletionInfo = await grpCollection.deleteOne({
    _id: ObjectId(groupId),
  });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${groupId}`;
  }
  return true;
};

const updateGroup = async (
  groupId,
  groupName,
  category,
  platformName,
  platformLoginId,
  platFormPassword,
  groupLimit,
  hashtags
) => {
  // groupId = validation.checkId(groupId, "groupId");

  hashtagArr = []
  if(hashtags){
    hashtagArr = hashtags.split("#");
    hashtagArr = hashtagArr.filter(element => {
      return element !== '';
    });
  }

  const grpCollection = await groups();
  const oldGrpData = await getGroupById(groupId);
  let updateGrpDetails = {
    groupName:groupName,
    category:category,
    platform:{
      platformName:platformName,
      platformLoginId: platformLoginId,
      platformPassword:platFormPassword
    },
    groupLimit:groupLimit,
    hashtags:hashtagArr,
  };

  const newUpdatedGrp = await grpCollection.updateOne(
    { _id: ObjectId(groupId) },
    { $set: updateGrpDetails }
  );
  if (!newUpdatedGrp.modifiedCount || !newUpdatedGrp.acknowledged) {
    throw "Cannot update user";
  }
  const group = await getGroupById(groupId);
  return group;

};
const updateListOfUsersInGroup = async (groupId,userId) => {
  // groupId = validation.checkId(groupId, "groupId");
  const grpCollection = await groups();
  const oldGrpData = await getGroupById(groupId);

  newList = oldGrpData.listOfUsers + userId
  let updateGrpDetails = {
    groupName:oldGrpData.groupName,
    profileImgUrl:"",
    platFormName:oldGrpData.platFormName,
    groupdLeaderId:oldGrpData.groupdLeaderId,
    groupLimit:oldGrpData.groupLimit,
    duePaymentDate:oldGrpData.duePaymentDate,
    loginId:oldGrpData.loginId,
    password:oldGrpData.password,
    subscriptionLengthInDays:oldGrpData.subscriptionLengthInDays,
    listOfUsers:newList
  };

  const newUpdatedGrp = await grpCollection.updateOne(
    { _id: ObjectId(groupId) },
    { $set: updateGrpDetails }
  );
  if (!newUpdatedGrp.modifiedCount || !newUpdatedGrp.acknowledged) {
    throw "Cannot update List of Users";
  }
  const group = await getGroupById(groupId);
  return group;

};

const removeUserFromRequestListInGroup = async (userId,groupId) =>{

  const grpCollection = await groups();
  const removeUserFromListOfUserInGroup = await grpCollection.updateOne({ _id:  ObjectId(groupId) },
    {$pull: { 'requestToJoin': userId }});

  if (!removeUserFromListOfUserInGroup.acknowledged){
    throw `removing requestToJoin Failed`
  }

}



module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  removeGroup,
  updateGroup,
  updateListOfUsersInGroup,
  searchGroup,
  sendRequest,
  removeUserFromRequestListInGroup,
  getRequestedUserByGroupLeaderId,
  udpateReadRequest,
  addReportToGroup
};
