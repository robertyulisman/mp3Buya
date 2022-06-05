const Express = require('express');
const Router = Express.Router();
const App = require("../models/application");
const Music = require("../models/music");
const Godev = require("../models/godev");
const Artist = require("../models/artist");
const musicMapper = require("../utils/mapper/musicMapper")

Router.get("/initData", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        const apps = await App.find(query).populate('list_artist', 'name').populate('godev', 'name').sort({ createdAt: -1 });
        var godevs = await Godev.find(query);
        godevs = godevs.map((value) => {
            var item = {
                name: "godev",
                value: value._id,
                label: value.name,
            }
            return item;
        })
        var artists = await Artist.find();
        artists = artists.map((value) => {
            var item = {
                name: "list_artist",
                value: value._id,
                label: value.name
            }
            return item;
        })
        var result = {
            apps: apps,
            godevs: godevs,
            artists: artists,
        }
        res.send(result)
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//getting All
Router.get("/many", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        const apps = await App.find(query).populate('list_artist', 'name').populate('godev', 'name').sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//get one
Router.get("/", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        var app = await App.findOne(query).populate('list_artist', 'name').populate('godev', 'name');
        res.status(200).json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//creating one
Router.post("/", async (req, res) => {
    try {
        var dataBody = Object.assign({}, req.body);
        var app = await App.exists({ packageName: dataBody.packageName })
        if (app)
            return res.status(400).json({ message: `Maaf packagename ${dataBody.packageName} sudah ada (duplikate)` });
        var newApp = new App(dataBody);
        await newApp.save();
        res.status(200).json(newApp);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//delete one
Router.delete("/", async (req, res) => {
    try {
        var id = req.query.id;
        var app = await App.deleteOne({ _id: id });
        res.status(200).json(app);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

//delete all
Router.delete("/many", async (req, res) => {
    try {
        var query = Object.assign({}, req.query);
        var result = await App.deleteMany(query);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
});

//update one by id
Router.patch("/", async (req, res) => {
    try {
        var id = req.query._id;
        var data = Object.assign({}, req.body)
        var result = await App.updateOne({ _id: id }, { $set: data })
        res.status(200).json(result);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getMusicByApp
Router.get("/audios", async (req, res) => {
    try {
        var query = Object.assign({}, req.query)
        var app = await App.findOne(query);
        var musics = await Music.find({ artist: { $in: app.list_artist } }).populate('artist', 'name').sort({ createdAt: -1 });
        let result = musicMapper.formatMusic(musics, req)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getCategoryByAppp
Router.get("/artist", async (req, res) => {
    try {
        var query = Object.assign({}, req.query)
        var app = await App.findOne(query).populate('list_artist')
        if (app){
            var baseUrl = `${req.protocol}s://${req.get('host')}`;
            var result = app.list_artist.map((value) => {
                var item = {
                    ...value._doc,
                    image : `${baseUrl}${value.image}`,
                }
                return item
            })
            res.status(200).json(result);
        }
            
        else
            res.status(404).json({ message: "data null" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

Router.get("/artistV2", async (req, res) => {
    try {
        let query = Object.assign({}, req.query)
        let app = await App.findOne(query);
        var artist = await Artist.find({_id: { $in: app.list_artist }})
        var baseUrl = `${req.protocol}s://${req.get('host')}`;
        // var musics = await Music.collection.aggregate([
        //     {
        //         $match : { artist: { $in: app.list_artist } }
        //     },
        //     {
        //         $group : { _id : "$artist", audios: { $push: "$$ROOT" } }
        //     },
        //     {
        //         $addFields:
        //           {
        //             totalAudios : { $sum: "$audios._id" },
        //             title: await Artist.findOne({_id: "5ebf8028df75395091b5450d"})
        //           }
        //       }
        // ]  
        // ).toArray()
        // var result = musics
        let musics = await Music.find({ artist: { $in: app.list_artist } }).populate('artist', 'name').sort({ createdAt: -1 })
        // musics = musics.map((value) => {
        //          var item = {
        //         ...value._doc,
        //         image: `${baseUrl}${value.image}`,
        //         url: `${baseUrl}${value.url}`,
        //         idArtist: value.artist,
        //         artist: value.artist ? value.artist.name : "",
        //     }
        //     delete item.urlDownload;
        //     return item;
        // })
        musics = musicMapper.formatMusic(musics, req)
        let result = artist.map((value) => {
            var audios = musics.filter((music) => music.artist === value.name.toString())
            let item =  {
                ...value._doc,
                image: `${baseUrl}${value.image}`,
                audios: audios,
                totalAudio: audios.length
            }
            return item
        })
        // var musics = await Music.find({ artist: { $in: app.list_artist } }).populate('artist', 'name').sort({ createdAt: -1 });
        // var baseUrl = `${req.protocol}s://${req.get('host')}`;
        // var result = musics.map((value) => {
        //     var item = {
        //         ...value._doc,
        //         image: `${baseUrl}${value.image}`,
        //         url: `${baseUrl}${value.url}`,
        //         artist: value.artist ? value.artist.name : "",
        //     }
        //     delete item.urlDownload;
        //     return item;
        // })
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getAdsByAppp
Router.get("/ads", async (req, res) => {
    try {
        var query = Object.assign({}, req.query)
        var app = await App.findOne(query)
        var result = app._doc
        delete result.ket
        delete result.list_artist
        delete result.godev
        delete result.user
        res.status(200).json(result);    
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getAdsByAppp
Router.get("/info", async (req, res) => {
    try {
        var query = Object.assign({}, req.query)
        var app = await App.findOne(query)
        var result = app._doc
        delete result.ket
        delete result.list_artist
        delete result.godev
        delete result.user
        res.status(200).json(result);    
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getTrending
Router.get("/audios/trending", async (req, res) => {
    try {
        var limit = req.query.limit ? req.query.limit : 0
        var app = await App.findOne({packageName: req.query.packageName});
        var musics = await Music.find({ artist: { $in: app.list_artist } }).populate('artist', 'name').sort({ views: -1 }).limit(parseInt(limit))
        let result = musicMapper.formatMusic(musics, req)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getLatestUploadByPackageName
Router.get("/audios/latest", async (req, res) => {
    try {
        var limit = req.query.limit ? req.query.limit : 0
        var app = await App.findOne({packageName: req.query.packageName});
        var musics = await Music.find({ artist: { $in: app.list_artist } }).populate('artist', 'name').sort({ createdAt: -1 }).limit(parseInt(limit))
        let result = musicMapper.formatMusic(musics, req)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//getRecent
Router.get("/audios/recent", async (req, res) => {
    try {
        const limit = req.query.limit ? req.query.limit : 0
        const musics = await Music.find().populate('artist', 'name').sort({ createdAt: -1 }).limit(parseInt(limit));
        let result = musicMapper.formatMusic(musics, req)
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = Router;