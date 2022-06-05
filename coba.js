// const fs = require('fs')
// const youtubedl = require('youtube-dl')
// const axios = require("axios").default;
// const cheerio = require("cheerio");
// var url = "https://www.youtube.com/watch?v=0GgbUvnAgIA"

// axios.get(url).then((result)=>{
//   var $ = cheerio.load(result.data);
//   var ini = $('#player').html().split("title")[1];
//   console.log("ini", ini);
// }).catch((err)=>console.log("err", err))

// const downloadMp3 = (url, nameFile) => {
//   return new Promise((resolve, reject) => {
//     const options = {
//       cwd: `${__dirname}/public/audios/`,
//     }
//     youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o'+nameFile+'.%(ext)s'], options, function (err, output) {
//       if (err) {
//         reject(err)
//       }
//       else
//         resolve(output)
//     })
//   });
// }

// downloadMp3(url, "barqi").then((r)=>{
//   console.log("hasil jos", r);
// }).catch((err)=>{
//   console.log("errjs", err);
// })

// const options = ['--username=user', '--password=hunter2']
 
// youtubedl.getInfo(url, options, function(err, info) {
//   if (err) throw err
 
//   console.log('id:', info.id)
//   console.log('title:', info.title)
//   console.log('url:', info.url)
//   console.log('thumbnail:', info.thumbnail)
//   console.log('description:', info.description)
//   console.log('filename:', info._filename)
//   console.log('format id:', info.format_id)
// })


// const ytScraper = require("yt-scraper")

// ytScraper.videoInfo("https://www.youtube.com/watch?v=cDVrJRXIq10", options = {}).then(console.log).catch(console.log)
// var fetchVideoInfo = require('youtube-info');
// fetchVideoInfo('cDVrJRXIq10').then(console.log, console.log);