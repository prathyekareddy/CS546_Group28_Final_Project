const express = require('express');
const router = express.Router();
const path = require('path');
const {fileURLToPath} = require('url')
const multer = require('multer');
const fs = require("fs");
const data = require('../data');
const { updateUserGroup } = require('../data/usergroup');
const groupData = data.groups;
const userData = data.users;
const userGroupData = data.usergroup;
const groupChatData = data.groupchat;
const createGroupValidation = require('../validations/createGroupValidation');
const helper = require("../validations/helper");
const stripe = require("stripe")(
  "sk_test_51MAdqdGXsyLIL2myfowY9UaAZt0rMOB9Z7A26k5yxVMMjLPunw4OTm8ZZMYp9HzvuOLUyBQPMd1NiMZqFd0Jr4Ci00chGfRsuW"
);
const dirName = path.resolve(path.dirname('../'));

router
    .route("/homepage")
    .get(async (req, res) => {
        res.sendFile(path.resolve('static/homepage.html'));
    })

router
    .route("/create")
    .get(async (req, res) => {
        // res.sendFile(path.resolve('static/create-group.html'));
        res.render('create-group');
    })
    .post(async (req, res) => {
        try {
          // result = createGroupValidation.checkCreateGroup(req.body.groupName, req.body.platFormName, req.session.user._id, req.body.groupLimit, req.body.dueDate, 'sabah@gmail.com', 'Password', req.body.subsLength);
            console.log(req.body.hashtags)
            createGroupData = await groupData.createGroup(req.session.user._id, 
              req.body.groupName,
              req.body.category, 
              req.body.platformName,
              parseInt(req.body.groupLimit), 
              req.body.dueDate,
              req.body.platformEmail, 
              req.body.platformPassword, 
              parseFloat(req.body.totalSubsPrice),
              parseInt(req.body.subsLength), 
              req.body.hashtags)
            createUserData = await userData.getUserById(req.session.user._id)
            arrUsers = [createUserData] //this will have list of users present in the group -> need a function that gets all the users present in the group
            res.render('group-details', {user: arrUsers, group: createGroupData})
        }
        catch(e) {
          return res.status(400).json({error: e});
        }
      });

router
.route("/updategroup")
.post(async (req, res) => {
  try{

    console.log("Reached to routes")
    updatedGroup = await groupData.updateGroup(req.body.groupid,
      req.body.groupName,
      req.body.category, 
      req.body.platformName,
      req.body.platformEmail, 
      req.body.platformPassword,
      parseInt(req.body.groupLimit),
      req.body.hashtags )
    res.redirect('/navigation/groupdetails/'+req.body.groupid);
  }catch(e){
    console.log(e);
  }
})

router
    .route("/search")
    .get(async (req, res) => {
        res.render('search-page', {notSearchedYet: true});
    })

let result = [];

router
    .post('/search.html', async (req, res) => {

        try{
            helper.checkSearch(req.body.groupName, req.body.category);
        } catch(e){
            console.log("Error: ",e);
            return;
        }

        let input = {category: req.body.category, groupName: req.body.groupName, userId: req.session.user._id};
        result = [];
        result = await groupData.searchGroup(input);
        if(result.length === 0){
            res.render('partials/searched-group', {layout: null, sampleResult: false});
            return;
        }
        res.render('partials/searched-group', {layout: null, sampleResult: result});
        
    });

router
    .route("/sendrequest/:id")
    .post(async (req, res) => {
        const updateResult  = async (groupId) => {
            result.forEach(element => {
                if(element.groupId.toString() === groupId){
                    element.requested = true;
                    element.notRequested = false;
                }
            });
        };
        groupId = helper.checkId(req.params.id);
        userId = helper.checkId(req.session.user._id);
        let updated = groupData.sendRequest(groupId,userId);
        if(updated){
            await updateResult(req.params.id);
        }
        res.render('partials/searched-group', {layout: null, sampleResult: result});
    })

router
.route("/mygroups")
.get(async (req, res) => {
  currentUser = await userData.getUserById(req.session.user._id)
  listOfGroups = currentUser.listOfGroups
  arrGroups = []
  for(let i = 0; i< listOfGroups.length;i++){
    arrGroups.push(await groupData.getGroupById(listOfGroups[i]))
  }
  res.render('my-groups',{user:currentUser,listOfGroups:listOfGroups, arrGroups:arrGroups});
})

let tryStripe;
let paymentForstripe;

router
    .route("/groupdetails/:id")
    .get(async (req, res) => {
      tryStripe = req.params.id;
     groupDetails = await groupData.getGroupById(req.params.id);
     paymentForstripe = groupDetails.payment.montlyPaymentForGroup / groupDetails.listOfUsers.length ;

      requestArr = []
      userArr = []

      try {
        if((groupDetails.requestToJoin).length > 0){
          for (i = 0; i < (groupDetails.requestToJoin).length; i ++){
            requestArr.push(await userData.getUserById((groupDetails.requestToJoin)[i]))
          }
        }
      } catch (error) {
        console.log(error)
      }

      try {
        if((groupDetails.listOfUsers).length > 0){
          for (i = 0; i < (groupDetails.listOfUsers).length; i ++){
            userArr.push(await userData.getUserById((groupDetails.listOfUsers)[i]))
          }
        }
      } catch (error) {
        console.log(error)
      }
      res.render('group-details', { group: groupDetails, requestToJoin : requestArr, user : userArr})
    })
router
    .route("/addusertogroup")
    .post(async (req, res) => {
      try{
        addUserToGroup = await userGroupData.addUserToGroup(req.body.userid,req.body.groupid)
        res.redirect('/navigation/groupdetails/'+req.body.groupid);
      }catch(e){
        console.log(e);
      }
    })
    router
    .route("/rejectUserToJoinGroup")
    .post(async (req, res) => {
      try{
        rejectUser = await groupData.removeUserFromRequestListInGroup(req.body.userid,req.body.groupid)
        res.redirect('/navigation/groupdetails/'+req.body.groupid);
      }catch(e){
        console.log(e);
      }
    })

    router.route("/checkout-page").get(async (req, res) => {
      try {
        const productAmount =paymentForstripe * 100;
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                unit_amount: productAmount,
                product_data: {
                  name: "NetPlix",
                  description: "cas",
                },
              },
              quantity: 1,
            },
          ],
    
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          success_url: `http://localhost:3000/navigation/success/${tryStripe}`,
          cancel_url:`http://localhost:3000/navigation/groupdetails/${tryStripe}`,
        });
        res.redirect(session.url);
      } catch (error) {
        console.log(error);
      }
    });

router
    .route("/chat/:id")
    .get(async (req, res) => {
        const groupChat = await groupChatData.getGroupChatByGroupId(req.params.id);
        req.session.chat = {groupId: req.params.id, groupChatId: groupChat._id};
        res.render('group-chat', {chat: groupChat.messages, groupID: req.params.id, username: req.session.user.username, email: req.session.user.emailId});
})

router
  .route('/send-message.html')
  .post(async (req, res) => {
    let newMessage = await groupChatData.sendMessage(req.session.chat.groupChatId.toString(),req.session.user.username, req.session.user.emailId, req.body.message);
    res.render('partials/display-messages', { layout: null, ...newMessage });
  });

  
    router.route('/success/:id').get(async (req,res)=>{
      try {
        let userId = req.session.user._id;
        let currDate = new Date();
        currDate = currDate.toString();
        await updateUserGroup("Paid",currDate,tryStripe,userId);
        res.redirect(`/navigation/groupdetails/${tryStripe}`);
      } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
      }
    })

    router.route('/failure').get(async (req,res)=>{
      try {
        res.render("stripe-error",{error:"Payment Failed"})
      } catch (e) {
        console.log(e);
      }
    })

router.route("/userProfile").get(async (req, res) => {
  if (req.session.user) {
    const userDetails = await data.users.getUserById(req.session.user._id);
    return res.render("userProfile", {
      title: "RProfile Page",
      user: userDetails,
    });
  } else {
  }
});

const destination = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (_, file, callback) => {
    callback(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: destination,
  fileFilter: (req, file, callback) => {
    if (!/\.(png|jpg|jpeg)$/.test(file.originalname))
      return callback(
        new Error(
          "Error: Upload a valid image file of extension .png or .jpg or .jpeg"
        )
      );
    callback(null, true); // file accepted
  },
});

const removeFile = (filePath) => {
  const directoryPath = path.join(dirName, filePath);
  try {
    fs.unlinkSync(directoryPath);
    return true;
  } catch (err) {
    return false;
  }
};

router
  .route("/editProfile")
  .get(async (req, res) => {
    if (req.session.user) {
      const userDetailsGetEdit = await data.users.getUserById(
        req.session.user._id
      );
      let interestedGetEdit = userDetailsGetEdit.interestedIn;
      for (let i in interestedGetEdit) {
        if (interestedGetEdit[i] == "OTT") {
          userDetailsGetEdit["OTT"] = "checked";
        } else if (interestedGetEdit[i] == "Music Streaming") {
          userDetailsGetEdit["MusicStreaming"] = "checked";
        } else if (interestedGetEdit[i] == "Education") {
          userDetailsGetEdit["Education"] = "checked";
        } else if (interestedGetEdit[i] == "Network Service Providers") {
          userDetailsGetEdit["NetworkServiceProviders"] = "checked";
        } else if (interestedGetEdit[i] == "E-Commerce") {
          userDetailsGetEdit["ECommerce"] = "checked";
        } else if (interestedGetEdit[i] == "Other") {
          userDetailsGetEdit["Other"] = "checked";
        }
      }
      return res.render("editProfile", {
        title: "Edit-Profile Page",
        user: userDetailsGetEdit,
      });
    } else {
    }
  })
  .post(async (req, res) => {
    const profileUpload = upload.single("profileImageInput");
    profileUpload(req, res, async (err) => {
      let profileImgUrl = null;
      try {
        if (err) {
          throw err;
        }
        let emailId = req.body.emailIdInput;
        let firstName = req.body.firstNameInput;
        let lastName = req.body.lastNameInput;
        let userDescription = req.body.userDescriptionInput;
        let gender = req.body.genderInput;
        if (req.file) {
          profileImgUrl = req.file.destination + req.file.filename;
        }
        let city = req.body.cityInput;
        let state = req.body.stateInput;
        let streetAddress = req.body.streetAddressInput;
        let phoneNumber = req.body.phoneNumberInput;
        let ott = req.body.interestedOTT;
        let musicStreaming = req.body.interestedMusicStreaming;
        let networkServiceProviders =
          req.body.interestedNetworkServiceProviders;
        let education = req.body.interestedEducation;
        let eCommerce = req.body.interestedECommerce;
        let other = req.body.interestedOther;

        //// Validations
        emailId = helper.checkString(emailId, "emailId");
        firstName = helper.checkString(firstName, "firstName");
        lastName = helper.checkString(lastName, "lastName");
        helper.editUserValidation(
          emailId,
          firstName,
          lastName,
          phoneNumber,
          ott,
          musicStreaming,
          networkServiceProviders,
          education,
          eCommerce,
          other,
          gender
        );
        //// DB
        if (req.file) {
          const oldUser = await data.users.getUserById(req.session.user._id);
          if (oldUser.profileImgUrl != null) {
            removeFile(oldUser.profileImgUrl);
          }
        } else {
          const oldUser = await data.users.getUserById(req.session.user._id);
          profileImgUrl = oldUser.profileImgUrl;
        }
        const ans = await data.users.updateUser(
          req.session.user._id,
          firstName,
          lastName,
          emailId,
          gender,
          userDescription,
          profileImgUrl,
          city,
          state,
          streetAddress,
          phoneNumber,
          ott,
          musicStreaming,
          networkServiceProviders,
          education,
          eCommerce,
          other
        );
        if (ans._id == req.session.user._id) {
          return res.redirect("/navigation/userProfile");
        }
      } catch (e) {
        const user = req.body;
        user.firstName = user.firstNameInput;
        user.lastName = user.lastNameInput;
        user.email = user.emailIdInput;
        user.phoneNumber = user.phoneNumberInput;
        user.gender = user.genderInput;
        user.address = {
          streetAddress: user.streetAddressInput,
          city: user.cityInput,
          state: user.stateInput,
        };
        user.userDescription = user.userDescriptionInput;
        if (user.interestedOTT) {
          user.OTT = "checked";
        }
        if (user.interestedMusicStreaming) {
          user.MusicStreaming = "checked";
        }
        if (user.interestedNetworkServiceProviders) {
          user.NetworkServiceProviders = "checked";
        }
        if (user.interestedEducation) {
          user.Education = "checked";
        }
        if (user.interestedECommerce) {
          user.ECommerce = "checked";
        }
        if (user.interestedOther) {
          user.Other = "checked";
        }
        const userDetails = await data.users.getUserById(req.session.user._id);
        user.profileImgUrl = userDetails.profileImgUrl;
        if (profileImgUrl != null && e != "Cannot update user") {
          removeFile(profileImgUrl);
        }
        if (e == "Cannot update user") {
          e = e + ". No changes to update";
        }
        return res
          .status(400)
          .render("editProfile", {
            title: "Edit-Profile Page",
            user: user,
            error: e,
          });
      }
    });
  });

module.exports = router;