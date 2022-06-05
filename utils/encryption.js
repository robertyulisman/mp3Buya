require("dotenv").config();

const NodeRSA = require('node-rsa');
const key = new NodeRSA(process.env.PRIVATE_KEY.replace(/\\n/g, '\n'));

const Encrypted = (text)=>{
    return key.encrypt(text, 'base64');
}

const Dectypted = (text)=>{
    return key.decrypt(text, 'utf8');
}

module.exports = {Encrypted, Dectypted};