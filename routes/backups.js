const express = require("express");
const router = express.Router();
const zip = require('bestzip');

const exec = require('child_process').exec;

router.get("/audios", async (req, res) => {
    try {
        let destination = "public/audios/audios_barqi_audio.zip"
        zip({
            source: 'public/audios',
            destination: destination
          }).then(function() {
            console.log('all done!');
            res.download(destination)
          }).catch(function(err) {
            console.error(err.stack);
            res.send(err.stack)
            process.exit(1);
          });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/database", async (req, res) => {
    try {
        let cmd = "mongodump --host=localhost --port=27017 --db=lagu_android --out=public/backup"
        exec(cmd, function(error, stdout, stderr) {
            if (error) {
                console.error(error);
                res.send(error)
                return;
              }
            let destination = "public/backup/database_barqi_audio.zip"
            zip({
                source: 'public/backup/lagu_android',
                destination: destination
              }).then(function() {
                console.log('all done!');
                res.download(destination)
              }).catch(function(err) {
                console.error(err.stack);
                res.send(err.stack)
                process.exit(1);
              });
          });          
       
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;
