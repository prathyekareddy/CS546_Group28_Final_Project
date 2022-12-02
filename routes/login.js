const express = require('express');
const router = express.Router();
const path = require('path');
const usersData = require('../data')
const validation = require("../validations/helper");

router
    .route("/login")
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('/navigation/homepage');
          }
          else{
            return res.render('login', {title: "Log-in"});
          }
    })
    .post(async (req, res) => {
        try{

          let username = req.body.usernameInput
          let password = req.body.passwordInput
          // username = usersData.checkString(username,"username")    
          // if(username.trim().length<4){ throw "Username should be atleast of length 4"}
          // if(username.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "Username should be alphanumeric"}
          // password = usersData.checkString(password,"password")
          // if(password.trim().length<6){ throw "Password should be atleast of length 4"}
          // if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
          // if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
          // if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
          const ans = await usersData.users.checkUser(username,password)
          if(JSON.stringify(ans)==JSON.stringify({authenticatedUser: true})){
            const takeId = await usersData.users.getUserByemail(username)
            req.session.user = {_id: takeId._id.toString()};
            return res.redirect('/navigation/homepage');
          }
          }catch(e){
            return res.status(400).render('login', {title: "Log-in",error:"Error status 400: "+e});
          }

    });
    

router
    .route("/register")
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('/navigation/homepage');
          }
          else{
           return  res.render('sign-up', {title: "Sign-up"});
          }
    })
    .post(async (req, res) => {
        try{
          let username = req.body.usernameInput
          let password = req.body.passwordInput
          let firstName = req.body.firstNameInput
          let lastName = req.body.lastNameInput
          let gender = req.body.genderInput
          let userDescription = req.body.userDescriptionInput
          let profileImgUrl = req.body.profileImgUrlInput
          let city = req.body.cityInput
          let state = req.body.stateInput
          let streetAddress = req.body.streetAddressInput
          let phoneNumber = req.body.phoneNumberInput
          // username = usersData.checkString(username,"username")    
          // if(username.trim().length<4){ throw "Username should be atleast of length 4"}
          // if(username.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "Username should be alphanumeric"}
          // password = usersData.checkString(password,"password")
          // if(password.trim().length<6){ throw "Password should be atleast of length 4"}
          // if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
          // if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
          // if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
          const ans = await usersData.users.createUser(password,firstName,lastName,username,gender,userDescription,profileImgUrl,city,state,streetAddress,phoneNumber)
          if(JSON.stringify(ans)==JSON.stringify({userInserted: true})){
            return res.redirect('/login');
          }
          
          }catch(e){
            return res.status(400).render('sign-up', {title: "Registration Page",error:"Error status 400: "+e});
          }
    });
router
    .route('/logout')
    .get(async (req, res) => {
        req.session.destroy()
        return res.redirect('/login');
    });

   


module.exports = router;