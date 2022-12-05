const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data');
const groupData = data.groups;
const userData = data.users;
const userGroupData = data.usergroup;
const groupChatData = data.groupchat;
const createGroupValidation = require('../validations/createGroupValidation');
const helper = require("../validations/helper");
const stripe = require("stripe")(
  "sk_test_51MAdqdGXsyLIL2myfowY9UaAZt0rMOB9Z7A26k5yxVMMjLPunw4OTm8ZZMYp9HzvuOLUyBQPMd1NiMZqFd0Jr4Ci00chGfRsuW"
);

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
            createGroupData = await groupData.createGroup(req.session.user._id, req.body.groupName,req.body.category, req.body.platformName,req.body.platformEmail, req.body.platformPassword, 
            parseInt(req.body.groupLimit), req.body.dueDate, parseFloat(req.body.totalSubsPrice),parseInt(req.body.subsLength))
            createUserData = await userData.getUserById(req.session.user._id)
            arrUsers = [createUserData] //this will have list of users present in the group -> need a function that gets all the users present in the group
            res.render('group-details', {user: arrUsers, group: createGroupData})
        }
        catch(e) {
          return res.status(400).json({error: e});
        }
      });

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

router
    .route("/groupdetails/:id")
    .get(async (req, res) => {

      groupDetails = await groupData.getGroupById(req.params.id)

      requestArr = []
      userArr = []

      try {
        if((groupDetails.requestToJoin).length > 0){
          for (i = 0; i < (groupDetails.requestToJoin).length; i ++){
            requestArr.push(await userData.getUserById((groupDetails.requestToJoin)[i]))
          }
        }
      } catch (error) {
        console.log("in getting reqs")
        throw error
      }

      try {
        if((groupDetails.listOfUsers).length > 0){
          for (i = 0; i < (groupDetails.listOfUsers).length; i ++){
            userArr.push(await userData.getUserById((groupDetails.listOfUsers)[i]))
          }
        }
      } catch (error) {
        console.log("In getting users")
        throw error
      }
      // res.render('group-details', {groupChatId: "638d456e2f857b24a31fbf5f"});
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

    router.route("/checkout-page").get(async (req, res) => {
      try {
        price = Number(price);
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price: "price_1MAdtxGXsyLIL2myAGYK5cE8",
              quantity: price,
            }
          ],
          allow_promotion_codes: true,
          billing_address_collection: "auto",
          success_url: "http://localhost:3000/navigation/groupdetails",
          cancel_url: "https://www.youtube.com/",
        });
        res.json({ url: session.url });
      } catch (error) {
        console.log(error);
      }
    });

router
    .route("/chat/:id")
    .get(async (req, res) => {
        const groupChat = await groupChatData.getGroupChatByGroupId(req.params.id);
        req.session.chat = {groupId: req.params.id, groupChatId: groupChat._id};
        console.log(req.session);
        res.render('group-chat', {chat: groupChat.messages, groupID: req.params.id, username: req.session.user.username, email: req.session.user.emailId});
})

router
  .route('/send-message.html')
  .post(async (req, res) => {
    let newMessage = await groupChatData.sendMessage(req.session.chat.groupChatId.toString(),req.session.user.username, req.session.user.emailId, req.body.message);
    res.render('partials/display-messages', { layout: null, ...newMessage });
  });

module.exports = router;