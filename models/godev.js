'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const godevSchema = Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    icon: { type: String, default : "/image/defaults/default-placeholder.png" },
    ket : { type: String, default : "edit keterangan godev disini" },
    user : { type: Schema.Types.ObjectId, ref: 'User', required : true},
}, {timestamps : true});

module.exports = mongoose.model('Godev', godevSchema)