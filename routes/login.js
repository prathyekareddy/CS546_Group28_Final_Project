const { Console } = require('console');
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs = require("fs");
const usersData = require('../data')
const validation = require("../validations/helper");

const dirName = path.resolve(path.dirname('../'));

router
    .route("/")
    .get(async (req, res) => {
      res.redirect('/login')
    })
    .post(async (req, res) => {
    });

router
    .route("/login")
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('/navigation/homepage');
          }
          else{
            return res.render('login', {title: "Log-in", layout: 'main-login-register'});
          }
    })
    .post(async (req, res) => {
        try{

          let emailId = req.body.emailIdInput
          let password = req.body.passwordInput
          // Validation
          emailId = validation.checkString(emailId,"emailId")    
          password = validation.checkString(password,"password")
          validation.checkUserValidation(emailId,password)
          // DB
          const ans = await usersData.users.checkUser(emailId,password)
          if(JSON.stringify(ans)==JSON.stringify({authenticatedUser: true})){
            const takeId = await usersData.users.getUserByemail(emailId)
            req.session.user = {_id: takeId._id.toString(), username: `${takeId.firstName} ${takeId.lastName}`, emailId: takeId.email};
            return res.redirect('/navigation/homepage');
          }
          }catch(e){
            // throw e
            return res.status(400).render('login', {title: "Log-in", layout: 'main-login-register',error:"Error status 400: "+e});
          }

    });


    const destination = multer.diskStorage({
      destination: "./public/uploads/",
      filename: (_, file, callback) => {
        callback( null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
      },
    });
    
    const upload = multer({
      storage: destination,
      fileFilter: (req, file, callback) => {
        if (!/\.(png|jpg|jpeg)$/.test(file.originalname))
          return callback("Please upload a Image");
        callback(null, true);
      },
    });

    const removeFile = (filePath) => {
      const directoryPath = path.join( dirName , filePath); 
      try {
        fs.unlinkSync(directoryPath);
        return true
      } catch (err) {
        return false
      }
    };
    

router
    .route("/register")
    .get(async (req, res) => {
        if (req.session.user) {
            return res.redirect('/navigation/homepage');
          }
          else{
           return  res.render('sign-up', {title: "Registration Page", layout: 'main-login-register'});
          }
    })
    .post(async (req, res) => {
      const profileUpload = upload.single("profileImageInput");
      profileUpload(req, res, async(err) => {
          let profileImgUrl = null
          try{
            if (err) {
              throw err
            }
            let emailId = req.body.emailIdInput
            let password = req.body.passwordInput
            let rePassword = req.body.rePasswordInput
            let firstName = req.body.firstNameInput
            let lastName = req.body.lastNameInput
            let gender = req.body.genderInput
            let userDescription = req.body.userDescriptionInput
            if(req.file){profileImgUrl = req.file.destination+req.file.filename}
            let city = req.body.cityInput
            let state = req.body.stateInput
            let streetAddress = req.body.streetAddressInput
            let phoneNumber = req.body.phoneNumberInput
            //// Validations
            emailId = validation.checkString(emailId,"emailId")
            firstName = validation.checkString(firstName,"firstName")
            lastName = validation.checkString(lastName,"lastName")
            password = validation.checkString(password,"password")
            rePassword = validation.checkString(rePassword,"rePassword")
            validation.createUserValidation(emailId,firstName,lastName,password,rePassword,phoneNumber,req.body.interestedOTT,req.body.interestedMusicStreaming,req.body.interestedNetworkServiceProviders,req.body.interestedEducation,req.body.interestedECommerce,req.body.interestedOther,gender)
            //// DB
            const ans = await usersData.users.createUser(password,rePassword,firstName,lastName,emailId,gender,userDescription,profileImgUrl,city,state,streetAddress,phoneNumber,req.body.interestedOTT,req.body.interestedMusicStreaming,req.body.interestedNetworkServiceProviders,req.body.interestedEducation,req.body.interestedECommerce,req.body.interestedOther)
            if(ans){
              return res.redirect('/login');
            }
            
            }catch(e){
              if(profileImgUrl!=null){
                removeFile(profileImgUrl)
              }
              let oldUser = req.body
              if(oldUser.interestedOTT){oldUser.interestedOTT="checked"}
              if(oldUser.interestedMusicStreaming){oldUser.interestedMusicStreaming="checked"}
              if(oldUser.interestedNetworkServiceProviders){oldUser.interestedNetworkServiceProviders="checked"}
              if(oldUser.interestedEducation){oldUser.interestedEducation="checked"}
              if(oldUser.interestedECommerce){oldUser.interestedECommerce="checked"}
              if(oldUser.interestedOther){oldUser.interestedOther="checked"}
              return res.status(400).render('sign-up', {title: "Registration Page",user:oldUser,error:e});
            }

      }
      );
    });
router
    .route('/logout')
    .get(async (req, res) => {
        req.session.destroy()
        return res.redirect('/login');
    });


module.exports = router;