const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const validation = require("../validations/helper");
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');
const helper = require("../validations/helper");
const saltRounds = 10;


const createUser = async (
  password,
  rePassword,
  firstName,
  lastName,
  email,
  gender,
  userDescription,
  profileImgUrl,
  city,
  state,
  streetAddress,
  phoneNumber,
  interestedOTT,
  interestedMusicStreaming,
  interestedNetworkServiceProviders,
  interestedEducation,
  interestedECommerce,
  interestedOther
) => {
  email = validation.checkString(email,"email")
  firstName = validation.checkString(firstName,"firstName")
  lastName = validation.checkString(lastName,"lastName")
  password = validation.checkString(password,"password")
  rePassword = validation.checkString(rePassword,"rePassword")
  let interestedIn = []
  if(interestedOTT){interestedIn.push(interestedOTT)}
  if(interestedMusicStreaming){interestedIn.push(interestedMusicStreaming)}
  if(interestedNetworkServiceProviders){interestedIn.push(interestedNetworkServiceProviders)}
  if(interestedEducation){interestedIn.push(interestedEducation)}
  if(interestedECommerce){interestedIn.push(interestedECommerce)}
  if(interestedOther){interestedIn.push(interestedOther)}
  validation.createUserValidation(email,firstName,lastName,password,rePassword,phoneNumber,interestedOTT,interestedMusicStreaming,interestedNetworkServiceProviders,interestedEducation,interestedECommerce,interestedOther,gender)

  const userCollection = await users();
  const emailFound = await userCollection.findOne({email:email});
  if(emailFound){
  if (emailFound.email.toLowerCase()==email.toLowerCase()){throw "email-id already exists kindly choose other email-id"}}
  
 const hash = await bcrypt.hash(password, saltRounds);

  let newUser = {
    password: hash,
    firstName: firstName,
    lastName: lastName,
    email: email.toLowerCase(),
    gender: gender,
    userDescription: userDescription,
    profileImgUrl: profileImgUrl,
    address: {city:city , state:state , streetAddress:streetAddress},
    phoneNumber: phoneNumber,
    listOfGroups: [],
    interestedIn:interestedIn
  };

  const insertedUser = await userCollection.insertOne(newUser);

  if (!insertedUser.acknowledged || !insertedUser.insertedId)
    throw "Could not add User";
  const insertedUserId = insertedUser.insertedId.toString();
  const user = await getUserById(insertedUserId);
  return user;
};

const getAllUsers = async () => {
  const userCollection = await users();
  return await userCollection.find({}).toArray();
};

const getUserById = async (userId) => {
  // userId = validation.checkId(userId, "id");
  const userCollection = await users();
  let user = await userCollection.findOne({ _id: ObjectId(userId) });
  user._id=user._id.toString()
  if (!user) throw "User not found";
  return user;
};

const getUserByemail = async (username) => {
  const usersCollection = await users();
  const user = await usersCollection.findOne({email:username})
  if (user === null) throw "No user with that username";
  return user
};

const removeUser = async (userId) => {
  userId = validation.checkId(userId, "id");
  const userCollection = await users();
  const deletionInfo = await userCollection.deleteOne({
    _id: ObjectId(userId),
  });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete user with id of ${userId}`;
  }
  return true;
};

const updateUser = async (
  userId,
  firstName,
  lastName,
  email,
  gender,
  userDescription,
  profileImgUrl,
  city,
  state,
  streetAddress,
  phoneNumber,
  interestedOTT,
  interestedMusicStreaming,
  interestedNetworkServiceProviders,
  interestedEducation,
  interestedECommerce,
  interestedOther
) => {
  console.log(userId,firstName,lastName,email,gender,userDescription,profileImgUrl,city,state,streetAddress,phoneNumber,interestedOTT,interestedMusicStreaming,interestedNetworkServiceProviders,interestedEducation,interestedECommerce,interestedOther)
  userId = validation.checkId(userId, "userId");

  email = validation.checkString(email,"email")
  firstName = validation.checkString(firstName,"firstName")
  lastName = validation.checkString(lastName,"lastName")
  let interestedIn = []
  if(interestedOTT){interestedIn.push(interestedOTT)}
  if(interestedMusicStreaming){interestedIn.push(interestedMusicStreaming)}
  if(interestedNetworkServiceProviders){interestedIn.push(interestedNetworkServiceProviders)}
  if(interestedEducation){interestedIn.push(interestedEducation)}
  if(interestedECommerce){interestedIn.push(interestedECommerce)}
  if(interestedOther){interestedIn.push(interestedOther)}
  validation.editUserValidation(email,firstName,lastName,phoneNumber,interestedOTT,interestedMusicStreaming,interestedNetworkServiceProviders,interestedEducation,interestedECommerce,interestedOther,gender)

  const userCollection = await users();
  // const oldUserData = await getMovieById(userId);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userDescription: userDescription,
    profileImgUrl: profileImgUrl,
    address: {city:city , state:state , streetAddress:streetAddress},
    phoneNumber: phoneNumber,
    interestedIn: interestedIn
  };

  const updateUser = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: newUser }
  );
  if (!updateUser.modifiedCount || !updateUser.acknowledged) {
    throw "Cannot update user";
  }
  const user = await getUserById(userId);
  return user;

};


const checkUser = async (emailId, password) => {

  emailId = validation.checkString(emailId,"username")
  emailId = emailId.toLowerCase()
  password = validation.checkString(password,"password")
  validation.checkUserValidation(emailId,password)

  const usersCollection = await users();
  const user = await usersCollection.findOne({email:emailId})
  if (user === null) throw "No user with that email-id";

  let compareToMatch = await bcrypt.compare(password, user.password);
  if (compareToMatch==true){
    return {authenticatedUser: true}
}else{
    throw "Either the username or password is invalid"
}

};

//Add Group to User function
const addGroupToUser = async (userId, groupId) => {
  userId = helper.checkId(userId.toString());
  groupId = helper.checkId(groupId.toString());
  const usersCollection = await users();
  const oldUserData = await getUserById(userId);

  oldUserData.listOfGroups.push(groupId);
  let updateUserDetails = {
    listOfGroups: oldUserData.listOfGroups
  };

  const updateUserInfo = await usersCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: updateUserDetails }
  );

  if (!updateUserInfo.modifiedCount || !updateUserInfo.acknowledged) {
    throw 'The list of groups could not be updated';
  }
  return true;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByemail,
  removeUser,
  updateUser,
  checkUser,
  addGroupToUser
};
