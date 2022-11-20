const { groups } = require("../data/");
const dbConnection = require("../config/mongo-connection");
const { users } = require("../data/");
const data = require("../data/");
const { removeUser, updateUser, getAllUsers, getUserById } = require("../data/users");
const { updateGroup } = require("../data/groups");

async function main() {
  const db = await dbConnection.dbConnection();
    await db.dropDatabase();

  for(let i=1;i<50;i++)
   {const user =  await users.createUser(
      "password",
      `User${i}`,
      "Bharambay",
      "yash@gmail.com",
      "male",
      "Hero",
      "",
      "Jersey City",
      "Hudson",
      "NJ",
      "Terrace Ave",
      "1234567890"
   );}

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


const group = await groups.createGroup(
"Neflix1",
"Netflix",
"63797aa6f22bd41b4c4e9775",
"4",
"19/11/2022",
"yash@netflix.com",
"password",
"30"
)

// await groups.updateGroup("","Spotify","");
  console.log("Done seeding database");


  await dbConnection.closeConnection();
}

main();
