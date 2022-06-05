require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const lyrics = express.Router();
const Crypto = require("../utils/encryption");
var moment = require('moment'); // require

async function isAvailable(req, res, next) {
    var isAvailable = JSON.parse(Crypto.Dectypted(process.env.lyricAPI))
    if(moment(new Date(), "DD/MM/YYYY").isAfter(moment(isAvailable.lyric, "DD/MM/YYYY"))){
        return res.status(500).json({
            message: "token expired"
        });
    }
    var token = req.headers["access-token"];
    if (token) {
        jwt.verify(token, process.env.API_KEY, (err, decoded) => {
            if (err) {
                return res.status(500).json({
                    message: "invalid token"
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(500).json({
            message: "No token provided."
        });
    }
}

module.exports = {isAvailable};
