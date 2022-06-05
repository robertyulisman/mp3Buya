const Express = require('express');
const Router = Express.Router();
const User = require("../models/user");
var multer = require('multer')
var imageManager = require('../utils/uploadImage');

// Set Storage
const storage = multer.diskStorage({
})

const upload = multer({ storage })

//getting All
Router.get("/all", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        const users = await User.find(query).sort({createdAt : -1})
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//getting One
Router.get("/", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        const user = await User.findOne(query);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

//creating one
Router.post("/", upload.single('image'), async (req, res) => {
    try {
        var query = Object.assign({}, req.body);
        var user = await User.exists({ userName: query.userName });
        if (user)
            return res.status(400).json({ message: `Maaf userName ${query.userName} sudah ada (Duplikat)` });
        var newUser = new User(query)
        await newUser.save();
        if (req.file) {
            var destImage = `public/images/users/${newUser._id}.webp`
            var image = await imageManager.uploadImage(destImage, req)
            await newUser.update({ image: image })
        }
        res.status(200).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//update one by id
Router.patch("/", upload.single('image'), async (req, res) => {
    try {
        var id = req.query.id;
        var query = Object.assign({}, req.body);
        var user = await User.findById(id);
        if (!user)
            return res.status(400).json({ message: `User not found` });
        console.log("req", req.file)
        if (req.file) {
            var destImage = `public/images/users/${user._id}.webp`
            var image = await imageManager.uploadImage(destImage, req)
            query.image = image
        }
        var result = await user.updateOne(query);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


//delete one
Router.delete("/", async (req, res) => {
    try {
        var id = req.query.id;
        var user = await User.findById(id)
        await imageManager.deleteImage(user.image)
        await user.remove();
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

//delete one
Router.delete("/deleteMany", async (req, res) => {
    try {
        var query = Object.assign({}, req.query)
        var user = await User.deleteMany(query)
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

module.exports = Router;