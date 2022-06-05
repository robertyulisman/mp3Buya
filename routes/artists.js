const Express = require('express');
const Router = Express.Router();
const Artist = require("../models/artist");
var multer = require('multer')
var imageManager = require('../utils/uploadImage');
const fs = require('fs');

// Set Storage
const storage = multer.diskStorage({
})

const upload = multer({ storage })

//getting All
Router.get("/many", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        const result = await Artist.find(query).sort({createdAt:-1});
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//getting One
Router.get("/", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        const result = await Artist.findOne(query);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

//creating one
Router.post("/",upload.single('image'), async (req, res) => {
    try {
        var dataBody = Object.assign({}, req.body);
        var artist = await Artist.exists({ name: dataBody.name });
        if (artist)
            return res.status(400).json({ message: `Maaf artist ${dataBody.name} sudah ada (Duplikat)` });
        var newArtist = new Artist(dataBody);
        await newArtist.save();
        if (req.file) {
            var destImage = `public/images/artist/${newArtist._id}.webp`
            var image = await imageManager.uploadImage(destImage, req)
            await newArtist.update({ image: image })
        }
        res.status(200).json(newArtist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//delete one
Router.delete("/", async (req, res) => {
    try {
        // var query = Object.assign({}, req.query);
        var artist = await Artist.deleteOne({_id: req.query.id})
        removeImage(req.query.id)
        res.status(200).json(artist);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

//delete one
Router.delete("/many", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        var artist = await Artist.deleteMany(query)
        res.status(200).json(artist);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});


//update one by id
Router.patch("/",upload.single('image'), async (req, res) => {
    try {
        var id = req.query.id;
        var dataBody = Object.assign({}, req.body);
        if (req.file) {
            var destImage = `public/images/artist/${id}.webp`
            var image = await imageManager.uploadImage(destImage, req)
            dataBody = {
                ...dataBody,
                image : image
            }
        }
        var result = await Artist.updateOne({ _id: id }, { $set: dataBody });
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const removeImage = (id) => {
    try {
        const pathImage = `public/images/artist/${id}.webp`
        if (fs.existsSync(pathImage))
            fs.unlinkSync(pathImage);
    } catch (err) {
        console.log("err",err)
    }
}


module.exports = Router;