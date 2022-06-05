const express = require("express");
const router = express.Router();
const exec = require('child_process').exec;
const fs = require('fs');
const rimraf = require("rimraf");
const diskusage = require('diskusage-ng');
const os = require('os');
let path = os.platform() === 'win32' ? 'c:' : '/';

router.get("/removeBackupAudios", async (req, res) => {
    try {
        let destination = "public/audios/audios_barqi_audio.zip"
        rimraf.sync(destination)
        res.send({ message: "success hapus zip backup audio" })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/removeBackupDatabase", async (req, res) => {
    try {
        let destination = "public/backup/lagu_android"
        let destinationZip = "public/backup/database_barqi_audio.zip"
        rimraf.sync(destination)
        // if(fs.exists(destinationZip))
        fs.unlinkSync(destinationZip)
        res.send({ message: "success hapus zip backup database" })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/checkSpace", async (req, res) => {
    try {
        diskusage('/', function(err, usage) {
            if (err) {
            console.log(err);
              return res.send(err)
            }
            var result = {
                available: convertBytes(usage.available),
                used: convertBytes(usage.total - usage.available),
                // used: convertBytes(usage.used),
                total: convertBytes(usage.total),
            }
            res.status(200).json(result);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const convertBytes = function(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  
    if (bytes == 0) {
      return "n/a"
    }
  
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  
    if (i == 0) {
      return bytes + " " + sizes[i]
    }
  
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
  }

module.exports = router;