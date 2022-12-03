const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const validation = require("../validations/helper");
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');
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
  email = validation.checkString(emailId,"email")
  firstName = validation.checkString(firstName,"firstName")
  lastName = validation.checkString(lastName,"lastName")
  password = validation.checkString(password,"password")
  validation.createUserValidation(firstName,lastName,password,phoneNumber)

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
    email: email.toLowerCase(),
    gender: gender,
    userDescription: userDescription,
    profileImgUrl: "profileImgUrl",
    address: {city:city , state:state , streetAddress:streetAddress},
    phoneNumber: phoneNumber,
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
  userId = validation.checkId(userId, "id");
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


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByemail,
  removeUser,
  updateUser,
  checkUser
};
