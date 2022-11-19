const express = require('express');
const router = express.Router();
const path = require('path');

router
    .route("/homepage")
    .get(async (req, res) => {
        res.sendFile(path.resolve('static/homepage.html'));
    })

router
    .route("/create")
    .get(async (req, res) => {
        res.sendFile(path.resolve('static/create-group.html'));
    })

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