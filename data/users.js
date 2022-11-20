const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const validation = require("../validations/helper");
const {ObjectId} = require('mongodb');


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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  removeUser,
  updateUser,
};
