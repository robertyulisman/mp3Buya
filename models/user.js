'use strict';

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userName: { type: String, required: true },
    pass: { type: String, required: true },
    level: {
        type: String,
        enum: [
            "Administrator",
            "Admin",
            "User",
        ],
        required: true
    },
    image : {type : String, default : "/images/defaults/default-placeholder.png"},
}, {timestamps : true})

module.exports = mongoose.model('User', userSchema)
