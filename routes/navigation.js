const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data');
const groupData = data.groups;
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
        //let groupInfo = req.body;
        try {
          result = createGroupValidation.checkCreateGroup(req.body.groupName, req.body.platFormName, req.session.user._id, req.body.groupLimit, req.body.dueDate, 'sabah@gmail.com', 'Password', req.body.subsLength);
        }
        catch(e) {
          return res.status(400).json({error: e});
        }
        try {
          //console.log(groupInfo);
          //console.log(req);
          //const {groupName, platFormName, groupdLeaderId, groupLimit, duePaymentDate, loginId, password, subscriptionLengthInDays} = groupInfo;
          const groupName = req.body.groupName;
          const platformName = req.body.platformName;
          const groupLeaderId = req.session.user._id;
          const groupLimit = req.body.groupLimit;
          const category = req.body.category;
          const dueDate = req.body.dueDate;
          const subsLength = req.body.subsLength;
          const new_group = await groupData.createGroup(
            groupName,
            platformName,
            req.session.user._id,
            groupLimit,
            dueDate,
            'sabah@gmail.com',
            'Password',
            subsLength,
            category
          );
            // res.render('group-details', {groupName: groupName});
            res.redirect('/navigation/groupdetails');
        }
        catch(e) {
          res.status(500).json({error: e});
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
    .route("/groupdetails")
    .get(async (req, res) => {
        res.render('group-details', {});
    })

    router.route("/checkout-page").get(async (req, res) => {
      try {
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price: "price_1MAdtxGXsyLIL2myAGYK5cE8",
              quantity: 1,
            },
            {
              price: "price_1MAfX1GXsyLIL2myFZU8pn6J",
              quantity: 1,
            },
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

module.exports = router;