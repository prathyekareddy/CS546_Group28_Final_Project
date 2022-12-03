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

          let emailId = req.body.emailIdInput
          let password = req.body.passwordInput
          // Validation
          emailId = validation.checkString(emailId,"username")    
          password = validation.checkString(password,"password")
          validation.checkUserValidation(emailId,password)
          // DB
          const ans = await usersData.users.checkUser(emailId,password)
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
          let emailId = req.body.emailIdInput
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
          //// Validations
          emailId = validation.checkString(emailId,"emailId")
          firstName = validation.checkString(firstName,"firstName")
          lastName = validation.checkString(lastName,"lastName")
          password = validation.checkString(password,"password")
          validation.createUserValidation(firstName,lastName,password,phoneNumber)
          //// DB
          const ans = await usersData.users.createUser(password,firstName,lastName,emailId,gender,userDescription,profileImgUrl,city,state,streetAddress,phoneNumber)
          if(ans){
            return res.redirect('/login');
          }
          
          }catch(e){
            return res.status(400).render('sign-up', {title: "Registration Page",error:e});
          }
    });
router
    .route('/logout')
    .get(async (req, res) => {
        req.session.destroy()
        return res.redirect('/login');
    });


module.exports = router;