const express = require('express');
const router = express.Router();
const path = require('path');

router
    .route("/login")
    .get(async (req, res) => {
        res.sendFile(path.resolve('static/login.html'));
    })
    .post(async (req, res) => {
        //if login is successful
        res.redirect('username/homepage');
    });
    

router
    .route("/register")
    .get(async (req, res) => {
        res.sendFile(path.resolve('static/register.html'));
    })
    .post(async (req, res) => {
        //if registration is successful
        res.redirect('/login');
    });


module.exports = router;