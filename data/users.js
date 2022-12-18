const mongoCollections = require("../config/mongo-collections");
const users = mongoCollections.users;
const validation = require("../validations/helper");
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');
const helper = require("../validations/helper");
const saltRounds = 10;

const sendInvite = async (groupId, userId) => {
  groupId = helper.checkId(groupId);
  userId = helper.checkId(userId);
  const userCollection = await users();
  const oldUserData = await getUserById(userId);

  oldUserData.invitedTo.push(groupId);
  let updateUserDetails = {
    invitedTo: oldUserData.invitedTo
  };

  const newUpdatedUser = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: updateUserDetails }
  );
  if (!newUpdatedUser.modifiedCount || !newUpdatedUser.acknowledged) {
    throw "Cannot update List of Users";
  }
  return true;
}

const searchUser = async (input) => {

  // try {
  //   helper.checkSearch(input.groupName, input.category);
  // } catch (e) {
  //   console.log("Error: ", e);
  // }

  const listOfUsers = await getAllUsers();
  let result = [];

  if (input.category) {
    listOfUsers.forEach(user => {
      if (user._id.toString() !== input.userId.toString()){
        if(user.interestedIn.includes(input.category)) {
          let newEntry = {
            userId: user._id,
            Name: `${user.firstName} ${user.lastName}`,
            interestedIn: user.interestedIn,
            invited: user.invitedTo.includes(input.groupId), 
          }
          newEntry.notInvited = !newEntry.invited;
          result.push(newEntry);
        }
      }
    });
  }
  return result;
  // if (input.category && input.groupName) {
  //   let tempResult = [];
  //   listOfGroups.forEach(group => {
  //     if (group.groupLimit.toString() !== group.listOfUsers.length.toString() && group.category.toLowerCase().includes(input.category.toLowerCase())) {
  //       let newEntry = {
  //         groupName: group.groupName,
  //         platform: group.platform.platformName,
  //         monthlyPayment: group.payment.montlyPaymentForGroup, 
  //         requested: group.requestToJoin.includes(input.userId), 
  //         groupId: group._id, 
  //         groupLimit: group.groupLimit, 
  //         totalMembers: group.listOfUsers.length, 
  //       }
  //       newEntry.notRequested = !newEntry.requested;
  //       tempResult.push(newEntry);
  //     }
  //   });
  //   tempResult.forEach(group => {
  //     if (group.groupName.toLowerCase().includes(input.groupName.toLowerCase())) {
  //       let newEntry = {
  //         groupName: group.groupName,
  //         platform: group.platform,
  //         monthlyPayment: group.monthlyPayment,
  //         requested: group.requested,
  //         notRequested: group.notRequested,
  //         groupId: group.groupId,
  //         groupLimit: group.groupLimit,
  //         totalMembers: group.totalMembers,
  //       }
  //       newEntry.yearlyPayment = Number(newEntry.monthlyPayment) * 12;
  //       result.push(newEntry);
  //     }
  //   });
  // }
  // else 
  
  // else if (input.groupName) {
  //   listOfGroups.forEach(group => {
  //     if (group.groupLimit.toString() !== group.listOfUsers.length.toString() && group.groupName.toLowerCase().includes(input.groupName.toLowerCase())) {
  //       let newEntry = {
  //         groupName: group.groupName,
  //         platform: group.platform.platformName,
  //         monthlyPayment: group.payment.montlyPaymentForGroup,
  //         requested: group.requestToJoin.includes(input.userId),
  //         groupId: group._id,
  //         groupLimit: group.groupLimit,
  //         totalMembers: group.listOfUsers.length,
  //       }
  //       newEntry.notRequested = !newEntry.requested;
  //       newEntry.yearlyPayment = Number(newEntry.monthlyPayment) * 12;
  //       result.push(newEntry);
  //     }
    // });
  // }
  
}

// Sabah
async function getAllUsersByUserIdList(groupCollections) {
  const userCollection = await users();
  let result=[];
  for (let group of groupCollections) {

    let requestToJoin = group.requestToJoin;

    let readRequToJoin = [];
    if (group.readRequestToJoin) {
      readRequToJoin = group.readRequestToJoin;
    }

    let unReadUserList = [];
    for (let requestToJoinUser of requestToJoin) {
      if (!readRequToJoin.includes(requestToJoinUser)) {
        let userId = ObjectId(requestToJoinUser)
        const unReadUser = await userCollection.findOne({ _id: userId })
        unReadUserList.push(unReadUser)
      }
    }
    if(unReadUserList.length>0){
      group.unReadUser = unReadUserList;
      result.push(group);
    }
  };
  return result;
}

// Sabah
async function getAllUsersByUserIdList(groupCollections) {
  const userCollection = await users();
  let result=[];
  for (let group of groupCollections) {

    let requestToJoin = group.requestToJoin;

    let readRequToJoin = [];
    if (group.readRequestToJoin) {
      readRequToJoin = group.readRequestToJoin;
    }

    let unReadUserList = [];
    for (let requestToJoinUser of requestToJoin) {
      if (!readRequToJoin.includes(requestToJoinUser)) {
        let userId = ObjectId(requestToJoinUser)
        const unReadUser = await userCollection.findOne({ _id: userId })
        unReadUserList.push(unReadUser)
      }
    }
    if(unReadUserList.length>0){
      group.unReadUser = unReadUserList;
      result.push(group);
    }
  };
  return result;
}

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
    interestedIn: interestedIn,
    invitedTo: []
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
  addGroupToUser,
  getAllUsersByUserIdList,
  searchUser,
  sendInvite
};
