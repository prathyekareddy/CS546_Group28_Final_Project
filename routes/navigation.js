const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data');
const groupData = data.groups;
const createGroupValidation = require('../validations/createGroupValidation');

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
        console.log('hello2', req);
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
        res.render('search-page', {});
    })

router
    .route("/groupdetails")
    .get(async (req, res) => {
        res.render('group-details', {});
    })

module.exports = router;