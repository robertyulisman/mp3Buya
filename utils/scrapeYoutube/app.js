const Express = require("express");
const Router = Express.Router();
const SingleVideo = require("./singleVideo");
const axios = require("axios").default;
require("dotenv").config();
const YT_API_KEY = process.env.YT_API;
// const IP = process.env.IP;
var get_ip = require("ipware")().get_ip;
const playlist = require("./playlist");
const moment = require("moment");

Router.get("/singel-video", async (req, res) => {
  try {
    var url = req.query.url;
    // var ip_info = get_ip(req);
    // console.log(ip_info);
    // var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
    //  req.connection.remoteAddress ||
    //  req.socket.remoteAddress ||
    //  req.connection.socket.remoteAddress
    // console.log("ip", ip)
    // var userIp = req.header('X-Real-IP') || req.connection.remoteAddress;
    // console.log("userIp", userIp)
    var result = await SingleVideo.getSingleVideo(url);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

Router.get("/data", async (req, res) => {
  try {
    // var ip = req.connection.remoteAddress;
    // console.log("ip", ip);
    // var userIp = req.header('X-Real-IP') || req.connection.remoteAddress;
    // console.log("userIp", userIp)
    // console.log("reqHeader", req.headers)
    // console.log(`IP ${IP} hasilnya : ${req.headers.host == IP}`)
    // const forwarded = req.headers['x-forwarded-for']
    // const ipku = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    // console.log("ipku : ", forwarded)

    // if(req.headers.host=='localhost:3005'|| req.headers.host == IP ){
    //     var idYT = req.query.id;
    //     var response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idYT}&key=${YT_API_KEY}`)
    //     var responseDuration = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${idYT}&part=contentDetails&key=${YT_API_KEY}`)
    //     var result = response.data.items[0].snippet
    //     duration = moment.duration(responseDuration.data.items[0].contentDetails.duration).asSeconds()
    //     result.duration = new Date(duration * 1000).toISOString().substr(11, 8)
    //     res.status(200).json(result);
    // } else
    // res.status(500).json('cie suhu nakal')

    var idYT = req.query.id;
    var response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${idYT}&key=${YT_API_KEY}`
    );
    var responseDuration = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${idYT}&part=contentDetails&key=${YT_API_KEY}`
    );
    var result = response.data.items[0].snippet;
    duration = moment
      .duration(responseDuration.data.items[0].contentDetails.duration)
      .asSeconds();
    result.duration = new Date(duration * 1000).toISOString().substr(11, 8);
    // result.thumbnails.push({
    //     maxres : result.thumbnails.high || result.thumbnails.medium || result.thumbnails.default
    // })
    // result.thumbnails.maxres = result.thumbnails.high || result.thumbnails.medium || result.thumbnails.default
    // result.thumbnails.maxres = `https://i.ytimg.com/vi/${idYT}/maxresdefault.jpg`
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

Router.get("/playlist", async (req, res) => {
  try {
    var idPlaylist = req.query.idPlaylist;
    var url = `https://www.youtube.com/playlist?list=${idPlaylist}`;
    let dataPlaylist = await playlist.getDataPlaylist(url);
    res.send(dataPlaylist);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = Router;
