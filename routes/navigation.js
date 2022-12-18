const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const {fileURLToPath} = require('url')
const fs = require("fs");
const data = require('../data');
const { updateUserGroup } = require('../data/usergroup');
const groupData = data.groups;
const userData = data.users;
const userGroupData = data.usergroup;
const groupChatData = data.groupchat;
const createGroupValidation = require('../validations/createGroupValidation');
const helper = require("../validations/helper");
const { removeUser } = require('../data/users');
const {ObjectId} = require('mongodb');
const stripe = require("stripe")(
  "sk_test_51MAdqdGXsyLIL2myfowY9UaAZt0rMOB9Z7A26k5yxVMMjLPunw4OTm8ZZMYp9HzvuOLUyBQPMd1NiMZqFd0Jr4Ci00chGfRsuW"
);
const dirName = path.resolve(path.dirname('../'));
const trimRequest = require('trim-request');
const xss = require("xss");
const { request } = require('http');
// const nodemailer = require("nodemailer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/group-images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let uploadGrpImg = multer({
  storage: storage,
}).single("groupImage")

router
    .route("/homepage")
    .get(async (req, res) => {

      //Notification
      let groupAdminId = req.session.user._id;
      let createGroupData = await groupData.getRequestedUserByGroupLeaderId(
        groupAdminId
      );
      res.render("homepage", { data: JSON.stringify(createGroupData), title: 'Home'});
    })
   
    router
    .route("/aboutUs")
    .get(async (req, res) => {
        res.render('about-us');
        
    })    

  router
    .route("/notifications-list")
    .get(async (req, res) => {
      let groupAdminId=req.session.user._id;
      let createGroupData=await groupData.getRequestedUserByGroupLeaderId(groupAdminId);
     
    return res.json({data:createGroupData});
    })

  router
    .route("/notifications-read-update")
    .post(async (req, res) => {
      let readRequestList=xss(req.body.readRequestList);
       
      readRequestList=req.body.readRequestList;
      if(!readRequestList){
        return res.status(400).json({ error: true,message:'readRequestList is required!' });
      }
      await groupData.udpateReadRequest(readRequestList)
      return res.json({message:"successfully updated!"});
    })
  

  // router
  // .route("/group-details/:id")
  // .get(async (req, res) => {
  //   let groupId = xss(req.params.id);
  //   try{
  //     helper.checkId(groupId)
  //   }catch(e){
  //     return res.status(400).json({ error: true,message:e });
  //   }
    
  //   let createGroupData=await groupData.getGroupById(groupId);
  //   let createUserData = await userData.getUserById(req.session.user._id);
  //   arrUsers = [createUserData]; //this will have list of users present in the group -> need a function that gets all the users present in the group
  //   res.render("group-details", { user: arrUsers, group: createGroupData, checkGroupLeader: checkGroupLeader, currUserId : req.session.user._id });
  // })
router
    .route("/create")
    .get(async (req, res) => {
        // res.sendFile(path.resolve('static/create-group.html'));
        res.render('create-group',  {title: 'Create a Group'});
    })
    .post(uploadGrpImg,trimRequest.all, async (req, res) => {
    try {
    if(!req.file) {
      return res.status(400).json({ error: true,message:'Invalid groupImage!',groupImage:"groupImage is required!"
      })}

      // if(req.session.user._id == ObjectId(createGroupData.groupLeaderId)){
      //   checkGroupLeader = true
      // }
      // else{
      //   checkGroupLeader = false
      // }

    if (req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg") 
    return res.status(400).json({ error: true,message:'Invalid groupImage!',groupImage:"Only JPG,PNG and JPEG are allowed!"});

    // Request Params
    const groupName = xss(req.body.groupName);
    const category = xss(req.body.category);
    const platformName = xss(req.body.platformName);
    const platformEmail = xss(req.body.platformEmail);
    const platformPassword = xss(req.body.platformPassword);
    const groupLimit = xss(req.body.groupLimit);
    const dueDate = xss(req.body.dueDate);
    const totalSubsPrice = xss(req.body.totalSubsPrice);
    const subsLength = xss(req.body.subsLength);
    const hashtags = xss(req.body.hashtags);

    // Validation on request params
    const validationErrorBag = createGroupValidation.checkCreateGroup(groupName, category, platformName, platformEmail,
      platformPassword, groupLimit, dueDate, totalSubsPrice, subsLength, hashtags);

    if (validationErrorBag.error) {
      return res.status(400).json(validationErrorBag);
    }
    createGroupData = await groupData.createGroup(
      req.session.user._id,
      groupName,
      req.file.filename,
      category,
      platformName,
      platformEmail,
      platformPassword,
      groupLimit,
      dueDate,
      totalSubsPrice,
      subsLength,
      hashtags
    );
    res.json({error:false,id:createGroupData._id});
  } catch (e) {
    console.log(e);
    // if(e===`There is already a group with that email`){
    //   return res.status(400).json({ error: true,message:e });
    // }else{
      return res.status(500).json({ error:true,message: 'Internal Server Error' });
    // }
  }
  });
router
.route("/updategroup")
.post(async (req, res) => {
  try{
    
    let groupName = req.body.groupName;
    let category = req.body.category;
    let platformName = req.body.platformName;
    let platformEmail =  req.body.platformEmail;
    let platformPassword =  req.body.platformPassword;
    let groupLimit =  req.body.groupLimit;
    let hashtags = req.body.hashtags;

    //validations
    helper.editGroupDetailsValidation(
      groupName,
      category, 
      platformName,
      platformEmail, 
      platformPassword,
      groupLimit
    );

    //updating group data
    const updatedGroup = await groupData.updateGroup(req.body.groupid,
      groupName,
      category, 
      platformName,
      platformEmail, 
      platformPassword,
      parseInt(groupLimit),
      hashtags )
    res.redirect('/navigation/groupdetails/'+req.body.groupid);
  }catch(e){
    res.render('error',  {error: e, groupId: req.body.groupid});
  }
}) 

router
    .route("/search")
    .get(async (req, res) => {
        res.render('search-page', {notSearchedYet: true,  title: 'Search Groups'});
    })

let result = [];

router
    .post('/search.html', async (req, res) => {

        try{
            helper.checkSearch(
              xss(req.body.groupName), 
              xss(req.body.category)
              );
        } catch(e){
            console.log("Error: ",e);
            return;
        }

        let input = {category: xss(req.body.category), groupName: xss(req.body.groupName), userId: req.session.user._id};
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
        groupId = helper.checkId(xss(req.params.id));
        userId = helper.checkId(req.session.user._id);
        let updated = groupData.sendRequest(groupId,userId);
        if(updated){
            await updateResult(req.params.id);
        }

    //Email notification
  //   let group= await groupData.getGroupById(groupId);
  //   let groupLeader = await userData.getUserById(group.groupdLeaderId);
  //   let user = await userData.getUserById(userId);
  //   var transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: 'sabahuhahmed@gmail.com',
  //       pass: 'msvjmslqnylhyjzx'
  //     }
  // })
  
  // var mailOptions = {
  //     from: user.email,
  //     to:groupLeader.email,
  //     subject:`Request for joining group ${group.groupName}`,
  //     text:`${user.firstName} ${user.lastName} wants to join group ${group.groupName}`
  // }
  
  // transporter.sendMail(mailOptions, function(error, info){
  //     if (error) {
  //         console.log(error)
  //     } else {
  //         console.log("Email Sent: " + info.response)
  //     }
  // })  
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
  res.render('my-groups',{user:currentUser, arrGroups:arrGroups,  title: 'My Groups: '});
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
      console.log(req.session.user._id + "session")
      console.log(groupDetails.groupLeaderId + "groupLeaderId")
      if(ObjectId(req.session.user._id).toString() == ObjectId(groupDetails.groupLeaderId).toString()){
        checkGroupLeader = true
        console.log("Group Leader")
      }
      else{
        console.log("Not Group Leader")
        checkGroupLeader = false
      }
      res.render('group-details', { group: groupDetails,
        requestToJoin : requestArr,
        user : userArr,
        currUserId : req.session.user._id,
        checkGroupLeader: checkGroupLeader,
      })
    })
router
    .route("/addusertogroup")
    .post(async (req, res) => {
      try{
        addUserToGroup = await userGroupData.addUserToGroup(
          xss(req.body.userid),
          xss(req.body.groupid)
        )
        res.redirect('/navigation/groupdetails/'+ xss(req.body.groupid));
      }catch(e){
        console.log(e);
      }
    })
    router
    .route("/rejectUserToJoinGroup")
    .post(async (req, res) => {
      try{
        rejectUser = await groupData.removeUserFromRequestListInGroup(xss(req.body.userid),xss(req.body.groupid))
        res.redirect('/navigation/groupdetails/'+ xss(req.body.groupid));
      }catch(e){
        console.log(e);
      }
    })
    router
    .route("/removeUserFromGroup")
    .post(async (req, res) => {
      console.log(req.body)
      try{
        userGroup = await userGroupData.getUserGroupbyGroupIdandUserId(req.body.groupid,req.body.userid)
      }catch(error){
        console.log(error);
      }
      try {
        await userGroupData.removeUserGroup(userGroup._id)
      } catch (error) {
        console.log(error);
      }
      try {
        await userGroupData.updatePayment(req.body.groupid)
      } catch (error) {
        console.log(error);
      }
      res.redirect('/navigation/groupdetails/'+req.body.groupid);
    })
    router
    .route("/reportUser")
    .post(async (req, res) => {
      try{
        // rejectUser = await groupData.removeUserFromRequestListInGroup(req.body.userid,req.body.groupid)
        console.log(req.body)
        reportuser = await groupData.addReportToGroup(req.body.groupid, req.body.reporteduserid, req.body.userid)
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
        const groupChat = await groupChatData.getGroupChatByGroupId(xss(req.params.id));
        req.session.chat = {groupId: xss(req.params.id), groupChatId: groupChat._id};
        res.render('group-chat', {chat: groupChat.messages, groupID: req.params.id, username: req.session.user.username, email: req.session.user.emailId});
})

router
    .route('/send-message.html')
    .post(async (req, res) => {
      let newMessage = await groupChatData.sendMessage(req.session.chat.groupChatId.toString(),req.session.user.username, req.session.user.emailId, req.body.message);
      res.render('partials/display-messages', { layout: null, ...newMessage });
    });

let userResults = [];
let currentGroupID;  

router
    .route('/search-user/:id')
    .get(async (req, res) => {
      currentGroupID = req.params.id;
      res.render('search-user', { notSearchedYet: true });
    });

router
    .post('/search-user.html', async (req, res) => {

      console.log(req.body.category);

      // try {
      //   helper.checkSearch(req.body.groupName, req.body.category);
      // } catch (e) {
      //   console.log("Error: ", e);
      //   return;
      // }

      let input = { category: req.body.category, groupId: currentGroupID, userId: req.session.user._id };
      userResults = [];
      userResults = await userData.searchUser(input);
      // console.log(userResults)
      if (userResults.length === 0) {
        res.render('partials/searched-user', { layout: null, sampleResult: false });
        return;
      }
      res.render('partials/searched-user', { layout: null, sampleResult: userResults });

    });

router
    .route("/send-invite/:id")
    .post(async (req, res) => {
      const updateResult = async (userId) => {
        userResults.forEach(element => {
          if (element.userId.toString() === userId) {
            console.log("here");
            element.invited = true;
            element.notInvited = false;
          }
        });
      };
      groupId = helper.checkId(currentGroupID);
      userId = helper.checkId(req.params.id);
      let updated = userData.sendInvite(groupId, userId);
      if (updated) {
        await updateResult(req.params.id);
      }
      res.render('partials/searched-user', { layout: null, sampleResult: userResults });
    })
  
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
        title: "Profile Page",
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
        let emailId = xss(req.body.emailIdInput);
        let firstName = xss(req.body.firstNameInput);
        let lastName = xss(req.body.lastNameInput);
        let userDescription = xss(req.body.userDescriptionInput);
        let gender = xss(req.body.genderInput);
        if (req.file) {
          profileImgUrl = req.file.destination + req.file.filename;
        }
        let city = xss(req.body.cityInput);
        let state = xss(req.body.stateInput);
        let streetAddress = xss(req.body.streetAddressInput);
        let phoneNumber = xss(req.body.phoneNumberInput);
        let ott = xss(req.body.interestedOTT);
        let musicStreaming = xss(req.body.interestedMusicStreaming);
        let networkServiceProviders =
          xss(req.body.interestedNetworkServiceProviders);
        let education = xss(req.body.interestedEducation);
        let eCommerce = xss(req.body.interestedECommerce);
        let other = xss(req.body.interestedOther);

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