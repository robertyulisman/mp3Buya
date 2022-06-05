const Express = require("express");
const Router = Express.Router();
const Music = require("../models/music");
const Artist = require("../models/artist");
const downloader = require("../utils/downloader");
const fs = require("fs");
const musicMapper = require("../utils/mapper/musicMapper");

Router.get("/initData", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    var musics = await Music.find(query)
      .populate("artist", "name")
      .sort({ createdAt: -1 });
    var baseUrl = `${req.protocol}://${req.get("host")}`;
    musics = musics.map((value, index) => {
      var item = {
        ...value._doc,
        image: `${baseUrl}${value.image}`,
        url: `${baseUrl}${value.url}`,
        no: (index += 1),
      };
      return item;
    });
    var artists = await Artist.find();
    artists = artists.map((value) => {
      var item = {
        name: "artist",
        value: value._id,
        label: value.name,
      };
      return item;
    });
    var result = {
      artists: artists,
      musics: musics,
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/many", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    var musics = await Music.find(query)
      .populate("artist", "name")
      .sort({ createdAt: -1 });
    let result = musicMapper.formatMusic(musics, req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/custom", async (req, res) => {
  try {
    let query = Object.assign({}, req.query);
    let musics = await Music.find(query)
      .populate("artist")
      .sort({ createdAt: -1 });
    // let result =  musics.filter(music => fs.existsSync(music.url) && music.artist !== null )
    res.json(musics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

Router.get("/", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    const music = await Music.findOne(query).populate("artist", "name");
    let result = musicMapper.formatMusic(music, req);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

Router.get("/search", async (req, res) => {
  try {
    var nameAudio = req.query.nameAudio;
    const music = await Music.find({
      title: { $regex: nameAudio, $options: "i" },
    }).populate("artist", "name");
    let result = musicMapper.formatMusic(music, req);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

Router.get("/byArtistId", async (req, res) => {
  try {
    var artistId = req.query.artistId;
    const music = await Music.find({ artist: artistId }).populate(
      "artist",
      "name"
    );
    let result = musicMapper.formatMusic(music, req);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

Router.post("/", async (req, res) => {
  var music;
  try {
    var dataBody = Object.assign({}, req.body);
    if (!dataBody.urlDownload.includes("https://www.youtube.com"))
      dataBody.urlDownload = `https://www.youtube.com/watch?v=${dataBody.urlDownload}`;
    // music = await Music.find({artist : dataBody.artist, urlDownload : {$regex : `.*${dataBody.urlDownload}*.`} })
    music = await Music.exists({
      artist: dataBody.artist,
      urlDownload: dataBody.urlDownload,
    });
    if (music)
      return res.status(400).json({
        message: `Maaf music dengan url Download <b>${dataBody.urlDownload}</b> sudah ada (Duplikat)`,
      });
    dataBody.last_view = Date.now();
    music = new Music(dataBody);
    music.url = `/audios/${music._id}.mp3`;
    music.image = `/images/audios/${music._id}.webp`;
    await music.save();
    await downloader.downloadMp3(dataBody.urlDownload, music._id);
    await downloader.downloadImage(dataBody.image, music._id);
    res.status(200).json(music);
  } catch (err) {
    console.log("error download lagu", err);
    res.status(400).json({ message: err.message, status: "gagal" });
  }
});

Router.delete("/", async (req, res) => {
  try {
    var id = req.query.id;
    var music = await Music.findById(id);
    if (!music)
      return res
        .status(400)
        .json({ message: `id_music ${id} tidak di temukan` });
    var promises = [];
    if (music.artist)
      promises.push(
        Artist.updateOne({ _id: music.artist }, { $pull: { list_music: id } })
      );
    promises.push(music.remove());
    removeFile(music);
    var result = await Promise.all(promises);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

const removeFile = (music) => {
  try {
    const pathMusic = `public/audios/${music._id}.mp3`;
    const pathImage = `public/images/audios/${music._id}.webp`;
    if (fs.existsSync(pathMusic)) fs.unlinkSync(pathMusic);
    if (fs.existsSync(pathImage)) fs.unlinkSync(pathImage);
  } catch (err) {
    console.log("err", err);
  }
};

Router.delete("/deleteAll", async (req, res) => {
  try {
    var query = Object.assign({}, req.query);
    var music = await Music.deleteMany(query);
    res.status(200).json(music);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

Router.patch("/", async (req, res) => {
  try {
    var id = req.query.id;
    var dataBody = Object.assign({}, req.body);
    if (dataBody.urlDownload && dataBody.urlDownload !== "")
      await downloader.downloadMp3(dataBody.urlDownload, dataBody._id);
    if (dataBody.image && dataBody.image !== "")
      await downloader.downloadImage(dataBody.image, dataBody._id);
    dataBody.url = `/audios/${id}.mp3`;
    dataBody.image = `/images/audios/${id}.webp`;
    var music = await Music.updateOne({ _id: id }, { $set: dataBody });
    res.status(200).json(music);
    // var id = req.query.id;
    // var music = getDataBody(req);
    // music._id = id;
    // music.update_at = Date.now();
    // var promises = [];
    // if (music.url != null && music.url !== "")
    //     promises.push(downloader.downloadMp3(music.url, music._id));
    // if (music.image != null && music.image !== "")
    //     promises.push(downloader.downloadImage(music.image, music._id));
    // promises.push(Music.updateOne({ _id: id }, { $set: music }))
    // var result = await Promise.all(promises);
    // res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//counter views by id
Router.patch("/counterViews", async (req, res) => {
  try {
    var id = req.query.id;
    var music = await Music.findById(id);
    music.views++;
    music.last_view = Date.now();
    var result = await music.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//sdad
module.exports = Router;
