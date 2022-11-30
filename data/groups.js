const mongoCollections = require("../config/mongo-collections");
const groups = mongoCollections.groups;
const validation = require("../validations/createGroupValidation")
const {ObjectId} = require('mongodb');
const createGroupValidation = require("../validations/createGroupValidation");
const userGroupData = require("./usergroup")

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

const createGroup = async (
  userid,
  groupName,
  // profileImgUrl,
  category,
  platFormName,
  groupdLeaderId,
  groupLimit,
  // memberIds,
  duePaymentDate,
  platformLoginId,
  platFormPassword,
  subscriptionLengthInDays,
  totalPaymentPrice,
  paymentPlanSpanInMonths
) => {

//Profile Images and memberIds who joins the grp will have to be updated

  const grpCollection = await groups();
  montlyPaymentForGroup = monthlyPaymentCalculator(totalPaymentPrice,paymentPlanSpanInMonths)
  let newGrp = {
    groupName:groupName,
    profileImgUrl:"",
    category:category,
    platForm:{
      platFormName:platFormName,
      platformLoginId: platformLoginId,
      platFormPassword:platFormPassword
    },
    groupdLeaderId:userid,
    groupLimit:groupLimit,
    duePaymentDate:duePaymentDate,
    payment:{
      totalPaymentPrice:totalPaymentPrice, //"54$"
      paymentPlanSpanInMonths:paymentPlanSpanInMonths, // 6
      montlyPaymentForGroup: montlyPaymentForGroup
    },
    listOfUsers:[userid]//userId list
  };
  const insertedGrp = await grpCollection.insertOne(newGrp);

  if (!insertedGrp.acknowledged || !insertedGrp.insertedId)
    throw "Could not create the group";
  const insertedGrpId = insertedGrp.insertedId.toString();
  const group = await getGroupById(insertedGrpId);


  if(userid){
    await userGroupData.createUserGroup(userid,insertedGrpId,montlyPaymentForGroup)
  }

  return group;
};

 function monthlyPaymentCalculator(totalPaymentPrice,paymentPlanSpanInMonths){
  if(paymentPlanSpanInMonths & totalPaymentPrice){
    const monthlyPayment = totalPaymentPrice/paymentPlanSpanInMonths
    return monthlyPayment
  }else{
    return 0
  }
  
};

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

// In updateGroup user can update the name and profile image also memberIds shall be updated here...

const updateGroup = async (groupId,groupName,
  profileImgUrl,
  // memberIds
  ) => {
    groupId = validation.checkId(groupId, "groupId");

    const grpCollection = await groups();
    const oldGrpData = await getGroupById(groupId);
    let updateGrpDetails = {
      groupName:groupName,
      profileImgUrl:"",
      platFormName:oldGrpData.platFormName,
      groupdLeaderId:oldGrpData.groupdLeaderId,
      groupLimit:oldGrpData.groupLimit,
      // memberIds:[groupdLeaderId],
      duePaymentDate:oldGrpData.duePaymentDate,
      loginId:oldGrpData.loginId,
      password:oldGrpData.password,
      subscriptionLengthInDays:oldGrpData.subscriptionLengthInDays
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
      // memberIds:[groupdLeaderId],
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

  

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  removeGroup,
  updateGroup,
  updateListOfUsersInGroup
};
