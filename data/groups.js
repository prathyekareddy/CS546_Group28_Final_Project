const mongoCollections = require("../config/mongo-collections");
const groups = mongoCollections.groups;
const validation = require("../validations/helper")
const {ObjectId} = require('mongodb');


const createGroup = async (
  groupName,
  // profileImgUrl,
  platFormName,
  groupdLeaderId,
  groupLimit,
  // memberIds,
  duePaymentDate,
  loginId,
  password,
  subscriptionLengthInDays
) => {

//Profile Images and memberIds who joins the grp will have to be updated

  const grpCollection = await groups();

  let newGrp = {
    groupName:groupName,
    profileImgUrl:"",
    platFormName:platFormName,
    groupdLeaderId:groupdLeaderId,
    groupLimit:groupLimit,
    memberIds:[],
    duePaymentDate:duePaymentDate,
    loginId:loginId,
    password:password,
    subscriptionLengthInDays:subscriptionLengthInDays
  };

  newGrp.memberIds.push(groupdLeaderId);

  const insertedGrp = await grpCollection.insertOne(newGrp);

  if (!insertedGrp.acknowledged || !insertedGrp.insertedId)
    throw "Could not create the group";
  const insertedGrpId = insertedGrp.insertedId.toString();
  const group = await getGroupById(insertedGrpId);
  return group;
};

const getAllGroups = async () => {
  const grpCollection = await groups();
  return await grpCollection.find({}).toArray();
};

const getGroupById = async (groupId) => {
  groupId = validation.checkId(groupId, "id");
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

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  removeGroup,
  updateGroup,
};
