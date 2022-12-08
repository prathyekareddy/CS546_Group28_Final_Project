const { groups } = require("../data/");
const dbConnection = require("../config/mongo-connection");
const { users } = require("../data/");
const { groupchat } = require("../data/");
const data = require("../data/");
const { removeUser, updateUser, getAllUsers, getUserById } = require("../data/users");
const { updateGroup } = require("../data/groups");
const userGroupData = require("../data/usergroup")

async function main() {
  const db = await dbConnection.dbConnection();
    await db.dropDatabase();

  // for(let i=1;i<50;i++)
  //  {const user =  await users.createUser(
  //     "password",
  //     `User${i}`,
  //     "Bharambay",
  //     `${i}yash@gmail.com`,
  //     "male",
  //     "Hero",
  //     "",
  //     "Jersey City",
  //     "NJ",
  //     "Terrace Ave",
  //     "1234567890"
  //  );}

  try{
    userCreated = await users.createUser("password",
    "Prathyeka reddy",
    "Reddy",
    "prathyeka@gmail.com",
    "Female",
    "Student",
    "",
    "Jersey City",
    "NJ",
    "Webster Ave",
    "1234567890")
  }catch{
    console.log("User Creating unsuccessful")
  }

  //     "password",
  //     "Ab",
  //     "Koch",
  //     "yash@gmail.com",
  //     "male",
  //     "Hero",
  //     "",
  //     "Jersey City",
  //     "Hudson",
  //     "NJ",
  //     "Terrace Ave",
  //     "1234567890"
  //  );
  //  await users.createUser(
  //     "password",
  //     "Sabah",
  //     "Ahmed",
  //     "yash@gmail.com",
  //     "female",
  //     "Dashing",
  //     "",
  //     "Jersey City",
  //     "Hudson",
  //     "NJ",
  //     "Terrace Ave",
  //     "1234567890"
  //  );
  //  await users.createUser(
  //     "password",
  //     "Prathyeka",
  //     "Reddy",
  //     "yash@gmail.com",
  //     "female",
  //     "Influenza",
  //     "",
  //     "Jersey City",
  //     "Hudson",
  //     "NJ",
  //     "Terrace Ave",
  //     "1234567890"
  //  );
  //  await users.createUser(
  //     "password",
  //     "Swaraj",
  //     "Patil",
  //     "yash@gmail.com",
  //     "male",
  //     "Model",
  //     "",
  //     "Jersey City",
  //     "Hudson",
  //     "NJ",
  //     "Terrace Ave",
  //     "1234567890"
  //  );
  //  await users.createUser(
  //     "password",
  //     "Patrick",
  //     "Hill",
  //     "yash@gmail.com",
  //     "male",
  //     "Professor",
  //     "",
  //     "Jersey City",
  //     "Hudson",
  //     "NJ",
  //     "Terrace Ave",
  //     "1234567890"
  //  );

  // try {
  //   await users.updateUser (
  //     "6379add720504203e06c005b",
  //     "password",
  //       "Patrick",
  //       "Hill",
  //       "yash@gmail.com",
  //       "male",
  //       "Professor",
  //       "",
  //       "Jersey City",
  //       "NJ",
  //       "Terrace Ave",
  //       "1234567890")
  // } catch (error) {
  //   console.log(error);
  // }

// const group = await groups.createGroup(
// "Neflix1",
// "Netflix",
// "63797aa6f22bd41b4c4e9775",
// "4",
// "19/11/2022",
// "yash@netflix.com",
// "password",
// "30"
// )

try{
  userCreated123 = await users.createUser("password",
  "Prathyeka reddy",
  "Reddy",
  `testuser@gmail.com`,
  "Female",
  "Student",
  "",
  "Jersey City",
  "NJ",
  "Webster Ave",
  "1234567890")
}catch(e){
  console.log("User Creating unsuccessful",e)
}
try{
  groupCreated123 = await groups.createGroup(userCreated123._id,`World`,
  "OTT",
  "Netflix",
  "4",
  "19/11/2022",
  "punugu@netflix.com",
  "password",
  30,
  2,
  6)
}catch(e){
  console.log("group Creating unsuccessful",e)
}


/*
  the function createEverythingEverywhereAllAtOnce creates a user then the user creates a group for a platform, 
  then we create multiple users who want to join the group. these users join the group. User failed to join as per the limit set for the group.

*/
try{
  await createEverythingEverywhereAllAtOnce()
}catch{
  console.log("createEverythingEverywhereAllAtOnce()")
}

async function createEverythingEverywhereAllAtOnce(){

  console.log("Creating 5 Groups where the group limit is full. This won't appear in the search");
  for(let i = 0; i < 5; i++){
    try{
      userCreated = await users.createUser("password",
      "Prathyeka reddy",
      "Reddy",
      `prathyekaAdmin${i}@gmail.com`,
      "Female",
      "Student",
      "",
      "Jersey City",
      "NJ",
      "Webster Ave",
      "1234567890")
    }catch(e){
      console.log("User Creating unsuccessful",e)
    }
  
    if(userCreated){
      // console.log(userCreated._id)

      if(i<3){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Netflix Group ${i} - Full`,
          "OTT",
          "Netflix",
          "4",
          "19/11/2022",
          "yash@netflix.com",
          "password",
          30,
          2,
          6)
          if(i===0){
            myId = groupCreated._id;
          }
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else {
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Apple Music Group${i - 3} - Full`,
          "Music Streaming",
          "Apple Music",
          "4",
          "19/11/2022",
          "yash@netflix.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      }
      
  
      if(groupCreated){
        for(let j = 0; j<3 ; j++){
          let userCreated2 = null;
          try{
            userCreated2 = await users.createUser("password",
              "Prathyeka reddy",
              "Reddy",
              `prathyeka${i}${j}@gmail.com`,
              "Female",
              "Student",
              "",
              "Jersey City",
              "NJ",
              "Webster Ave",
              "1234567890")
          }catch(e){
            console.log("User Creating unsuccessful",e)
          }
          try{
            addUserToGroup1 = await userGroupData.addUserToGroup(userCreated2._id,groupCreated._id)
          }catch(e){
            console.log(e);
          }
        }
      }
    }
  }

  console.log("Creating 10 OTT Groups where there are slots to join. This will appear in the search");
  for(let i = 0; i < 10; i++){
    try{
      userCreated = await users.createUser("password",
      "Prathyeka reddy",
      "Reddy",
      `prathyekaOTTAdmin${i}@gmail.com`,
      "Female",
      "Student",
      "",
      "Jersey City",
      "NJ",
      "Webster Ave",
      "1234567890")
    }catch(e){
      console.log("User Creating unsuccessful",e)
    }
  
    if(userCreated){
      // console.log(userCreated._id)
  
      if(i<3){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Netflix Group ${i}`,
          "OTT",
          "Netflix",
          "4",
          "19/11/2022",
          "yash@netflix.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(2<i && i<6){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`HBO MAX Group${i - 3}`,
          "OTT",
          "HBO MAX",
          "5",
          "19/11/2022",
          "yash@hbomax.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(5<i && i<10){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Hulu Group${i - 6}`,
          "OTT",
          "Hulu",
          "6",
          "19/11/2022",
          "yash@hulu.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      }
      
  
      if(groupCreated){
        for(let j = 0; j<1 ; j++){
          let userCreated2 = null;
          try{
            userCreated2 = await users.createUser("password",
              "Prathyeka reddy",
              "Reddy",
              `prathyekaOTT${i}${j}@gmail.com`,
              "Female",
              "Student",
              "",
              "Jersey City",
              "NJ",
              "Webster Ave",
              "1234567890")
          }catch(e){
            console.log("User Creating unsuccessful",e)
          }
          try{
            addUserToGroup1 = await userGroupData.addUserToGroup(userCreated2._id,groupCreated._id)
          }catch(e){
            console.log(e);
          }
        }
      }
    }
  }

  console.log("Creating 10 Network Service Provider Groups where there are slots to join. This will appear in the search");
  for(let i = 0; i < 10; i++){
    try{
      userCreated = await users.createUser("password",
      "Prathyeka reddy",
      "Reddy",
      `prathyekaNSPAdmin${i}@gmail.com`,
      "Female",
      "Student",
      "",
      "Jersey City",
      "NJ",
      "Webster Ave",
      "1234567890")
    }catch(e){
      console.log("User Creating unsuccessful",e)
    }
  
    if(userCreated){
      // console.log(userCreated._id)
  
      if(i<3){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`AT&T Group ${i}`,
          "Network Service Provider",
          "AT&T",
          "6",
          "19/11/2022",
          "yash@AT&T.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(2<i && i<6){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`T-Mobile Group${i - 3}`,
          "Network Service Provider",
          "T-Mobile",
          "6",
          "19/11/2022",
          "yash@TMobile.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(5<i && i<10){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Verizon Group${i - 6}`,
          "Network Service Provider",
          "Verizon",
          "10",
          "19/11/2022",
          "yash@Verizon.com",
          "password",
          30,
          2,
          6)
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      }
      
  
      if(groupCreated){
        for(let j = 0; j<1 ; j++){
          let userCreated2 = null;
          try{
            userCreated2 = await users.createUser("password",
              "Prathyeka reddy",
              "Reddy",
              `prathyekaNSP${i}${j}@gmail.com`,
              "Female",
              "Student",
              "",
              "Jersey City",
              "NJ",
              "Webster Ave",
              "1234567890")
          }catch(e){
            console.log("User Creating unsuccessful",e)
          }
          try{
            addUserToGroup1 = await userGroupData.addUserToGroup(userCreated2._id,groupCreated._id)
          }catch(e){
            console.log(e);
          }
        }
      }
    }
  }
  
};
//   console.log("Creating a User")

//   try{
//     userCreated = await users.createUser("password",
//     "Prathyeka reddy",
//     "Reddy",
//     "prathyeka@gmail.com",
//     "Female",
//     "Student",
//     "",
//     "Jersey City",
//     "NJ",
//     "Webster Ave",
//     "1234567890")
//     console.log("User Creating successful")
//   }catch{
//     console.log("User Creating unsuccessful")
//   }

//   if(userCreated){
//     console.log(userCreated + " : userCreater")
//     console.log(userCreated._id)

//     try{
//       groupCreated = await groups.createGroup(userCreated._id,"Neflix1",
//       "OTT",
//       "Netflix",
//       "yash@netflix.com",
//       "password",
//       "4",
//       "19/11/2022",
//       2,
//       6)
//       console.log("group Creating successful")
//     }catch{
//       console.log("group Creating unsuccessful")
//     }
//     if(groupCreated){
//         try{
//           userCreated2 = await users.createUser("password",
//             "Prathyeka reddy",
//             "Reddy",
//             "prathyeka21@gmail.com",
//             "Female",
//             "Student",
//             "",
//             "Jersey City",
//             "NJ",
//             "Webster Ave",
//             "1234567890")
//             console.log("User Creating successful")
//         }catch{
//           console.log("User Creating unsuccessful")
//         }
//         try{
//           userCreated3 = await users.createUser("password",
//           "Prathyeka reddy3333",
//           "Reddy",
//           "prathyeka3@gmail.com",
//           "Female",
//           "Student",
//           "",
//           "Jersey City",
//           "NJ",
//           "Webster Ave",
//           "1234567890")
//         }catch{
//           console.log("User Creating unsuccessful")
//         }
//         try{
//           userCreated4 = await users.createUser("password",
//           "Prathyeka reddy44",
//           "Reddy",
//           "prathyeka4@gmail.com",
//           "Female",
//           "Student",
//           "",
//           "Jersey City",
//           "NJ",
//           "Webster Ave",
//           "1234567890")
//         }catch{
//           console.log("User Creating unsuccessful")
//         }
//         try{
//           userCreated5 = await users.createUser("password",
//           "Prathyeka reddy44",
//           "Reddy",
//           "prathyeka5@gmail.com",
//           "Female",
//           "Student",
//           "",
//           "Jersey City",
//           "NJ",
//           "Webster Ave",
//           "1234567890")
//         }catch{
//           console.log("User Creating unsuccessful")
//         }
//     }

//     try{
//       addUserToGroup1 = await userGroupData.addUserToGroup(userCreated2._id,groupCreated._id)
//       addUserToGroup2 = await userGroupData.addUserToGroup(userCreated3._id,groupCreated._id)
//       addUserToGroup3 = await userGroupData.addUserToGroup(userCreated4._id,groupCreated._id)
//       addUserToGroup4 = await userGroupData.addUserToGroup(userCreated5._id,groupCreated._id)
//     }catch{}
//   }
// };

// ////the below try catch testes the removal of auser from a group and updating the payment after the user is removed. 
// // //provided the groupid the updatePayment function will also update just the payment for all the users currently present in the grpoup. 
// // // try {
////  //   console.log("Removing userID: " + userCreated2._id +  "with userGroupid: " +addUserToGroup1._id+ " from group: "+ groupCreated._id)
////  //   removal = await userGroupData.removeUserGroup(addUserToGroup1._id)
////  //   await userGroupData.updatePayment(removal.groupId)
//   console.log(typeof groupCreated._id)
//   await groups.updateGroup(groupCreated._id, "NewGroupName");
// // //   console.log(typeof groupCreated._id)
//   await groups.updateGroup(groupCreated._id, "NewGroupName");
// } catch (error) {
////  //   console.log(error)
// // // }

// await groups.updateGroup("","Spotify","");
  console.log("Done seeding database");


  await dbConnection.closeConnection();
}

main();
