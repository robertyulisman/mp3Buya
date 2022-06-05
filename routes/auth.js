require("dotenv").config();

const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    if (!query.userName || !query.pass)
      return res
        .status(404)
        .json({ message: `username dan password tidak boleh kosong` });
    const user = await User.findOne(query, { pass: 0 });
    if (!user)
      return res.status(404).json({ message: `user tidak di temukan` });
    const payload = {
      check: true,
    };

    var token = jwt.sign(payload, process.env.API_KEY);
    console.log("token", token);
    var result = {
      ...user._doc,
      token: token,
    };
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
