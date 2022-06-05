const Express = require("express");
const Router = Express.Router();
const Godev = require("../models/godev");
const Application = require("../models/application");
const User = require("../models/user");
const mongoose = require("mongoose");

//getting All
Router.get("/many", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    if (query.user) query.user = new mongoose.Types.ObjectId(query.user);
    const godevs = await Godev.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: Application.collection.name,
          localField: "_id",
          foreignField: "godev",
          as: "list_app",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.json(godevs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//getting one
Router.get("/", async (req, res) => {
  res.status(200).json({ message: "okee" });
  // try {
  //   var query = Object.assign({}, req.query);
  //   var result = await Godev.findOne(query);
  //   res.send(result);
  // } catch (err) {
  //   res.status(500).json({ message: err.message });
  // }
});

//creating one
Router.post("/", async (req, res) => {
  try {
    var dataBody = Object.assign({}, req.body);
    var tempBody = { ...dataBody };
    delete tempBody.email;
    var godev = await Godev.exists(tempBody);
    if (godev)
      return res
        .status(400)
        .json({ message: `Maaf godev ${dataBody.name} sudah ada (Duplikat)` });
    var newGodev = new Godev(dataBody);
    await newGodev.save();
    res.status(200).json(newGodev);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update one by id
Router.patch("/", async (req, res) => {
  try {
    var id = req.query.id;
    var body = Object.assign({}, req.body);
    var result = await Godev.updateOne({ _id: id }, { $set: body });
    res.send(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//delete one
Router.delete("/", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    var godev = await Godev.deleteOne(query);
    res.status(200).json(godev);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

//delete all
Router.delete("/many", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    var godev = await Godev.deleteMany(query);
    res.status(200).json(godev);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = Router;
