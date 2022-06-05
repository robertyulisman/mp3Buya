const express = require("express");
const Router = express.Router();
const Restore = require("../utils/restore")

Router.get("/audios", async (req, res) => {
    try {
        let url = req.query.url
        let pageStart = req.query.pageStart
        let pageEnd = req.query.pageEnd
        let result = await Restore.restoreAudio(url, pageStart, pageEnd)
        res.send({ message: result })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

Router.get("/imageArtist", async (req, res) => {
    try {
        let url = req.query.url
        let pageStart = req.query.pageStart
        let pageEnd = req.query.pageEnd
        let result = await Restore.restoreImageArtist(url, pageStart, pageEnd)
        res.send({ message: result })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

Router.get("/imageAudio", async (req, res) => {
    try {
        let url = req.query.url
        let pageStart = req.query.pageStart
        let pageEnd = req.query.pageEnd
        let result = await Restore.restoreImage(url, pageStart, pageEnd)
        res.send({ message: result })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = Router;