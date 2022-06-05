'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const artistSchema = Schema({
    name: { type: String, required: true },
    image: { type: String, default : "/images/defaults/default-placeholder.png" },
}, {timestamps : true});

module.exports = mongoose.model('Artist', artistSchema)