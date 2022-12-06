const mongoCollections = require("../config/mongo-collections");
const userGroupData = mongoCollections.usergroup;
const groups = mongoCollections.groups;
const groupCol = mongoCollections.groups
const validation = require("../validations/helper");
const {ObjectId} = require('mongodb');
const groupData = require('./groups');
const userData = require('./users');
const e = require("express");
const userCol = mongoCollections.users;

const createUserGroup = async (
    userId ,
    groupId,
    // curentPaymentStatus,
    // paymentHistory,
    monthlyPaymentPrice
  ) => {
    const userGroupCollection = await userGroupData();

    dateJoined = new Date().toUTCString()
    let newUser = {
        userId: ObjectId(userId),
        groupId: ObjectId(groupId),
        curentPaymentStatus: null,
        paymentHistory: [],
        dateJoined: dateJoined,
        monthlyPaymentPricePerUser:monthlyPaymentPrice
    };
  
    const insertedUser = await userGroupCollection.insertOne(newUser);
  
    if (!insertedUser.acknowledged || !insertedUser.insertedId)
      throw "Could not add User";
    const insertedUserId = insertedUser.insertedId.toString();
    const usergroup = await getUserGroupById(insertedUserId);
    return usergroup;
  };
  
  const getUserGroupById = async (usergroupId) => {
    // userId = validation.checkId(usergroupId, "id");
    const usergroupCollection = await userGroupData();
    const usergroup = await usergroupCollection.find({ _id: ObjectId(usergroupId)});
    if (!usergroup) throw "Group not found for this user";
    return usergroup;
  };
  const getUserGroupByUserId = async (userId) => {
    // userId = validation.checkId(usergroupId, "id");
    const usergroupCollection = await userGroupData();
    const usergroup = await usergroupCollection.find({ userId: ObjectId(userId)});
    if (!usergroup) throw "Group not found for this user";
    return usergroup;
  };
  
  //Recommending updatePayment function along with removeUserGoup
  const removeUserGroup = async (usergroupId) => { 
    // userId = validation.checkId(usergroupId, "id");
    userGroup = await getUserGroupById(usergroupId)
    const usergroupCollection = await userGroupData();
    
    const deletionInfo = await usergroupCollection.deleteOne({
      _id: usergroupId,
    });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user group with id of ${usergroupId}`;
    }

    await removeUserFromListOfUserInGroup(userGroup)
    return userGroup;
  };

  //updatePayment function updates the payments based on the number of users in the group.
  const updatePayment = async (groupId) => {

    const groupcollection2 = await groups();
    const group = await groupcollection2.findOne({ _id: ObjectId(groupId) });

    listOfUsers = (group.listOfUsers.length);
    updatedPerPersonPrice = group.payment.montlyPaymentForGroup/listOfUsers;
    await updatePaymentForAllUsers(groupId,updatedPerPersonPrice);
  }

  //removeUserFromListOfUserInGroup removes the user from the list containing all the users for the group.
  const removeUserFromListOfUserInGroup = async (userGroup) =>{

    const grpCollection = await groups();
    const removeUserFromListOfUserInGroup = await grpCollection.updateOne({ _id: userGroup.groupId },
      {$pull: { 'listOfUsers': ObjectId(userGroup.userId) }});

    if (!removeUserFromListOfUserInGroup.acknowledged){
      throw `removing listOfUser Failed`
    }

  }


  //adds the user to the list of users for the group, calculates the  montly payment For the user based on number of useres and creates the 
  //the user group.
  const addUserToGroup = async (
    userId ,
    groupId,
    curentPaymentStatus,
    paymentHistory,
  ) => {
    const userGroupCollection = await userGroupData();
    const groupcollection = await groupCol();
    const group = await groupcollection.findOne({ _id: ObjectId(groupId) });

    listOfUsers = (group.listOfUsers.length) + 1;
    updatedPerPersonPrice = group.payment.montlyPaymentForGroup/listOfUsers;

    if(listOfUsers>group.groupLimit){
      throw 'User can not join! Group limit reached.'
    }else{
      group.listOfUsers.push(ObjectId(userId))
    }

    requestList = group.requestToJoin.filter(function(e) { return e !== userId })

    dateJoined = new Date().toUTCString()
  
    let newUserGroup = {
        userId: userId,
        groupId: groupId,
        curentPaymentStatus: null,
        paymentHistory: [],
        dateJoined: dateJoined,
        monthlyPaymentPricePerUser:updatedPerPersonPrice
    };
  
    const insertedUser = await userGroupCollection.insertOne(newUserGroup);
  
    if (!insertedUser.acknowledged || !insertedUser.insertedId)
      throw "Could not add User";
    const insertedUserId = insertedUser.insertedId.toString();


    const usergroup = await getUserGroupById(insertedUserId);

    await updatePaymentForAllUsers(groupId,updatedPerPersonPrice);

    const updateListOfUsersInGroup = await groupcollection.updateOne(
      {_id:ObjectId(groupId)},
      {$set:{listOfUsers: group.listOfUsers, requestToJoin:requestList}}
    )

    if(!updateListOfUsersInGroup.acknowledged){
      throw `User List Not Updated`
    }

    await userData.addGroupToUser(userId, groupId);
    
    return usergroup;
  };
  
  //This function will update the payment for each user in the group. 
  const updatePaymentForAllUsers = async(groupId,updatedPerPersonPrice) =>{

    const usergroupCollection = await userGroupData();
    const updatedUserGroup = await usergroupCollection.updateMany(
      { groupId: ObjectId(groupId) },
      { $set: {monthlyPaymentPricePerUser:updatedPerPersonPrice}}
    );

    if (!updatedUserGroup.acknowledged) {
      throw "Cannot update price for all user groups belonging to the same group";
    }
  };
  
 //this function need to be implemented when we complete payment processing. 
 //this function is to update the payment status and payment history list.
  const updateUserGroup = async (
    curentPaymentStatus,
    paymentHistory
  ) => {
    usergroupId = validation.checkId(usergroupId, "id");
  
    const usergroupCollection = await usergroup();
    const oldUserGroupcollection = await getUserGroupById(usergroupId);
    
    let updatedUserGroup = {
      curentPaymentStatus: curentPaymentStatus,
      paymentHistory: paymentHistory
    };
  
    const updateUserGroup = await usergroupCollection.updateOne(
      { _id: ObjectId(usergroupId) },
      { $set: updatedUserGroup}
    );
    if (!updatedUserGroup.modifiedCount || !updatedUserGroup.acknowledged) {
      throw "Cannot update user group";
    }
    const usergroup = await getUserGroupById(usergroupId);
    return usergroup;
  
  };
  
  module.exports = {
    createUserGroup,
    getUserGroupById,
    removeUserGroup,
    updateUserGroup,
    addUserToGroup,
    updatePayment,
    getUserGroupByUserId
  };