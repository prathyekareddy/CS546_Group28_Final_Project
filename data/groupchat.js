const mongoCollections = require("../config/mongo-collections");
const groupchat = mongoCollections.groupchat;
const {ObjectId} = require('mongodb');
const helper = require("../validations/helper");

const createGroupChat = async (
    groupId,
  ) => {
  
    const grpChatCollection = await groupchat();
    let newChat = {
      groupId: groupId,
      messages: []
    };
    const insertedChat = await grpChatCollection.insertOne(newChat);
  
    if (!insertedChat.acknowledged || !insertedChat.insertedId)
      throw "Could not create the group";
    const insertedChatId = insertedChat.insertedId.toString();
    const groupChat = await getGroupChatById(insertedChatId);
    return groupChat;
  };

const getGroupChatById = async (groupChatId) => {
    // groupId = validation.checkId(groupId, "id");
    const grpChatCollection = await groupchat();
    const grpChat = await grpChatCollection.findOne({ _id: ObjectId(groupChatId) });
    if (!grpChat) throw "Group Chat not found";
    return grpChat;
};

const getGroupChatByGroupId = async (groupId) => {
  // groupId = validation.checkId(groupId, "id");
  console.log(groupId);
  const groupChats = await getAllGroupChats();
  const grpChat = groupChats.find(data => {
    console.log("in");
    console.log(data.groupId.toString(), groupId);
    console.log(data.groupId.toString() === groupId);
    if(data.groupId.toString() === groupId){
      console.log(data);
      return data;
    }
  });
  if (!grpChat) throw "Group Chat not found";
  return grpChat;
};

const getAllGroupChats = async () => {
  const grpCollection = await groupchat();
  return await grpCollection.find({}).toArray();
};



const sendMessage = async (groupChatId, username, email, message) => {
  groupChatId = helper.checkId(groupChatId.toString());
  //basic string and email validation
  const grpChatCollection = await groupchat();
  const oldGrpChatData = await getGroupChatById(groupChatId);

  const messageObj = {
    username: username,
    email: email,
    message: message
  }

  oldGrpChatData.messages.push(messageObj);
  let updateGrpCharDetails = {
    messages: oldGrpChatData.messages
  };

  const newUpdatedGrpChat = await grpChatCollection.updateOne(
    { _id: ObjectId(groupChatId) },
    { $set: updateGrpCharDetails }
  );
  if (!newUpdatedGrpChat.modifiedCount || !newUpdatedGrpChat.acknowledged) {
    throw "Cannot update chat messages";
  }
  return messageObj;
}

module.exports = {
    createGroupChat,
    getGroupChatById,
    getGroupChatByGroupId,
    getAllGroupChats,
    sendMessage
  };