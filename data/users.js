const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const validation = require("../validations/helper");
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');
const helper = require("../validations/helper");
const saltRounds = 10;


const createUser = async (
  password,
  firstName,
  lastName,
  email,
  gender,
  userDescription,
  profileImgUrl,
  city,
  state,
  streetAddress,
  phoneNumber
) => {
  const userCollection = await users();
  const emailsList = await userCollection.find({},{projection: {_id: 0,email:1}}).toArray();
  if (!emailsList) throw "Could not get all emails";
 for(let i in emailsList){
  if (emailsList[i]["email"].toLowerCase()==email.toLowerCase()){throw "email-id already exists kindly choose other email-id"}
 }
  
 const hash = await bcrypt.hash(password, saltRounds);

  let newUser = {
    password: hash,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userDescription: userDescription,
    profileImgUrl: "profileImgUrl",
    address: {city:city , state:state , streetAddress:streetAddress},
    phoneNumber: phoneNumber,
    listOfGroups: []
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
  const user = await userCollection.findOne({ _id: ObjectId(userId) });
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
  password,
  firstName,
  lastName,
  email,
  gender,
  userDescription,
  profileImgUrl,
  city,
  state,
  streetAddress,
  phoneNumber
) => {
  userId = validation.checkId(userId, "movieId");

  const userCollection = await users();
  // const oldUserData = await getMovieById(userId);
  let newUser = {
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    userDescription: userDescription,
    profileImgUrl: profileImgUrl,
    address: {city:city , state:state , streetAddress:streetAddress},
    phoneNumber: phoneNumber,
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


const checkUser = async (username, password) => {
  // username = validation.checkString(username,"username")
  // username = username.trim().toLowerCase()
  // password = validation.checkString(password,"password")
  // if(username.trim().length<4){ throw "Username should be atleast of length 4"}
  // if(password.trim().length<6){ throw "Password should be atleast of length 4"}
  // if(username.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "Username should be alphanumeric"}
  // if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
  // if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
  // if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}

  //Match regex for special characters is yet to be done

  const usersCollection = await users();
  const user = await usersCollection.findOne({email:username})
  if (user === null) throw "No user with that username";

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
