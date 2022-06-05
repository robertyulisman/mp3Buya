const fs = require("fs");
const youtubedl = require("youtube-dl");
const imageDl = require("image-downloader");
const sharp = require("sharp");
var path = require("path");

var url = "https://www.youtube.com/watch?v=0GgbUvnAgIA";

const downloadMp3 = (url, nameFile) => {
  return new Promise((resolve, reject) => {
    const options = {
      cwd: `${path.resolve("./public")}/audios/`,
    };
    youtubedl.exec(
      url,
      ["-x", "--audio-format", "mp3", "-o" + nameFile + ".%(ext)s"],

      options,
      function (err, output) {
        if (err) {
          reject(err);
        } else resolve(output);
      }
    );
    // youtubedl.exec(
    //   url,
    //   ["-x", "--audio-format", "mp3"],
    //   {},
    //   function (err, output) {
    //     if (err) throw err;

    //     console.log(output.join("\n"));
    //   }
    // );
  });
};

const downloadImage = (url, nameFile) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        url: url,
        dest: `public/images/audios/${nameFile}.jpg`,
      };
      var fileDownload = await imageDl.image(options);
      var outputFile = `public/images/audios/${nameFile}.webp`;
      await sharp(fileDownload.filename).resize(800).toFile(outputFile);
      fs.unlinkSync(fileDownload.filename);
      resolve(outputFile);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { downloadMp3, downloadImage };

// downloadImage("https://i.ytimg.com/vi/ieAtzE98le0/maxresdefault.jpg", "ayamtahu2").then((r) => {
//   console.log("hasil jos", r);
// }).catch((err) => {
//   console.log("errjs", err);
// });

// downloadMp3(url, "barqi").then((r)=>{
//   console.log("hasil jos", r);
// }).catch((err)=>{
//   console.log("errjs", err);
// })
