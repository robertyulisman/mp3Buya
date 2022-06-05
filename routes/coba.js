const Express = require('express');
const Router = Express.Router();
const diCodingScrapper = require('../scrapeDicoding');

//getting one
Router.get("/dicoding", async (req, res) => {
    try {
        var url = req.query.url
        var result = await diCodingScrapper.getData(url)
        res.send(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = Router;