const { groups } = require("../data/");
const dbConnection = require("../config/mongo-connection");
const { users } = require("../data/");
const { groupchat } = require("../data/");
const data = require("../data/");
const { removeUser, updateUser, getAllUsers, getUserById } = require("../data/users");
const { updateGroup } = require("../data/groups");
const userGroupData = require("../data/usergroup")
let groupCreated;
let userCreated;

async function main() {
  const db = await dbConnection.dbConnection();
    await db.dropDatabase();

  try{
    userCreated = await users.createUser("Password@123",
    "Password@123",
    "Prathyeka reddy",
    "Reddy",
    "prathyeka@gmail.com",
    "Female",
    "Student",
    "",
    "Jersey City",
    "NJ",
    "Webster Ave",
    "1234567890",
    "OTT",
    null,
    "Network Service Providers",
    null,
    "E-Commerce",
    null
    )
  }catch(e){
    console.log("User Creating unsuccessful",e)
  }

let userCreated123

try{
  userCreated123 = await users.createUser("Password@123",
  "Password@123",
  "Prathyeka reddy",
  "Reddy",
  "testuser@gmail.com",
  "Female",
  "Student",
  "",
  "Jersey City",
  "NJ",
  "Webster Ave",
  "1234567890",
  "OTT",
    null,
    "Network Service Providers",
    null,
    "E-Commerce",
    null)
}catch(e){
  console.log("User Creating unsuccessful",e)
}
try{
  groupCreated123 = await groups.createGroup(userCreated123._id,`World`,"",
  "OTT",
  "Netflix",
  "punugu@netflix.com",
  "Password@123",
  "4",
  "11/19/2023",
  "300",
  "12",
  "#asdxas#asdasd#sada")
}catch(e){
  console.log("group Creating unsuccessful",e)
}


/*
  the function createEverythingEverywhereAllAtOnce creates a user then the user creates a group for a platform, 
  then we create multiple users who want to join the group. these users join the group. User failed to join as per the limit set for the group.

*/
try{
  await createEverythingEverywhereAllAtOnce()
}catch(e){
  console.log("createEverythingEverywhereAllAtOnce()",e)
}

async function createEverythingEverywhereAllAtOnce(){

  console.log("Creating 5 Groups where the group limit is full. This won't appear in the search");
  for(let i = 0; i < 5; i++){
    try{
      userCreated = await users.createUser("Password@123",
      "Password@123",
      "Prathyeka reddy",
      "Reddy",
      `prathyekaAdmin${i}@gmail.com`,
      "Female",
      "Student",
      "",
      "Jersey City",
      "NJ",
      "Webster Ave",
      "1234567890",
      "OTT",
    null,
    "Network Service Providers",
    null,
    "E-Commerce",
    null)
    }catch(e){
      console.log("User Creating unsuccessful",e)
    }
  
    if(userCreated){
      // console.log(userCreated._id)

      

      if(i<3){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Netflix Group ${i} - Full`,"",
          "OTT",
          "Netflix",
          "yash@netflix.com",
          "Password@123",
          "4",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
          if(i===0){
            myId = groupCreated._id;
          }
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else {
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Apple Music Group${i - 3} - Full`,"",
          "Music Streaming",
          "Apple Music",
          "yash@netflix.com",
          "Password@123",
          "4",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      }
      
  
       if(groupCreated){
        for(let j = 0; j<3 ; j++){
          let userCreated2 = null;
          try{
            userCreated2 = await users.createUser("Password@123",
              "Password@123",
              "Prathyeka reddy",
              "Reddy",
              `prathyeka${i}${j}@gmail.com`,
              "Female",
              "Student",
              "",
              "Jersey City",
              "NJ",
              "Webster Ave",
              "1234567890",
    null,
    "Music Streaming",
    null,
    "Education",
    null,
    "Other")
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
      userCreated = await users.createUser("Password@123",
      "Password@123",
      "Prathyeka reddy",
      "Reddy",
      `prathyekaOTTAdmin${i}@gmail.com`,
      "Female",
      "Student",
      "",
      "Jersey City",
      "NJ",
      "Webster Ave",
      "1234567890",
      null,
    "Music Streaming",
    null,
    "Education",
    null,
    "Other")
    }catch(e){
      console.log("User Creating unsuccessful",e)
    }
  
    if(userCreated){
      console.log(userCreated._id)
  
      if(i<3){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Netflix Group ${i}`,"",
          "OTT",
          "Netflix",
          "yash@netflix.com",
          "Password@123",
          "4",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(2<i && i<6){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`HBO MAX Group${i - 3}`,"",
          "OTT",
          "HBO MAX",
          "yash@hbomax.com",
          "Password@123",
          "5",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(5<i && i<10){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Hulu Group${i - 6}`,"",
          "OTT",
          "Hulu",
          "yash@hulu.com",
          "Password@123",
          "6",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      }
      
  
      if(groupCreated){
        for(let j = 0; j<1 ; j++){
          let userCreated2 = null;
          try{
            userCreated2 = await users.createUser("Password@123",
            "Password@123",
              "Prathyeka reddy",
              "Reddy",
              `prathyekaOTT${i}${j}@gmail.com`,
              "Female",
              "Student",
              "",
              "Jersey City",
              "NJ",
              "Webster Ave",
              "1234567890",
              "OTT",
              null,
              "Network Service Providers",
              null,
              "E-Commerce",
              null)
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

  console.log("Creating 10 Network Service Providers Groups where there are slots to join. This will appear in the search");
  for(let i = 0; i < 10; i++){
    try{
      userCreated = await users.createUser("Password@123",
      "Password@123",
      "Prathyeka reddy",
      "Reddy",
      `prathyekaNSPAdmin${i}@gmail.com`,
      "Female",
      "Student",
      "",
      "Jersey City",
      "NJ",
      "Webster Ave",
      "1234567890",
      null,
    "Music Streaming",
    null,
    "Education",
    null,
    "Other")
    }catch(e){
      console.log("User Creating unsuccessful",e)
    }
  
    if(userCreated){
      console.log(userCreated._id)
  
      if(i<3){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`AT&T Group ${i}`,"",
          "Network Service Providers",
          "AT&T",
          "yash@ATT.com",
          "Password@123",
          "6",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(2<i && i<6){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`T-Mobile Group${i - 3}`,"",
          "Network Service Providers",
          "T-Mobile",
          "yash@TMobile.com",
          "Password@123",
          "6",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      } else if(5<i && i<10){
        try{
          groupCreated = await groups.createGroup(userCreated._id,`Verizon Group${i - 6}`,"",
          "Network Service Providers",
          "Verizon",
          "yash@Verizon.com",
          "Password@123",
          "10",
          "02/19/2023",
          "30",
          "2",
          "#asdxas#asdasd#sada")
        }catch(e){
          console.log("group Creating unsuccessful",e)
        }
      }
      
  
      if(groupCreated){
        for(let j = 0; j<1 ; j++){
          let userCreated2 = null;
          try{
            userCreated2 = await users.createUser("Password@123",
            "Password@123",
              "Prathyeka reddy",
              "Reddy",
              `prathyekaNSP${i}${j}@gmail.com`,
              "Female",
              "Student",
              "",
              "Jersey City",
              "NJ",
              "Webster Ave",
              "1234567890",
              null,
    "Music Streaming",
    null,
    "Education",
    null,
    "Other")
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
  console.log("Done seeding database");


  await dbConnection.closeConnection();
}
}
main();



