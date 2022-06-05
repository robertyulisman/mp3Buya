const download = require('download');
require("dotenv").config();
const axios = require("axios").default;
const pLimit = require('p-limit');
const limit = pLimit(10);

async function restoreAudio(baseUrlRestore, pageStart, pageEnd) {
    try {
        let urlGet = baseUrlRestore+"/api/musics/custom"
        let response = await axios.get(urlGet, {
            headers: {
                'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNjA2Mjg5MzExfQ.fMPANK7oHpHA6itw0DXPaigG48qHPkgVcTrolOyTZ2o'
            }
        })
        let listData = response.data.map(audio => baseUrlRestore+audio.url)
        var listAudio = []
        listData.forEach((value, index)=>{
            if (index >= pageStart && index <= pageEnd)
            listAudio.push(value)
        })
        let result = {
            listAudio: listAudio,
        }
        console.log(result)
        await Promise.all(listAudio.map(url =>  limit(()=>downloadFile(url, 'public/audios'))))
        console.log("limit active", limit.activeCount)
        console.log("pageStart:", pageStart, "pageEnd:", pageEnd)
        console.log("success")
        return Promise.resolve("success")
    } catch (err) {
        console.log("erro: ", err)
        return Promise.resolve("error", err)
    }

}

async function restoreImage(baseUrlRestore, pageStart, pageEnd) {
    try {
        let urlGet = baseUrlRestore+"/api/musics/custom"
        let response = await axios.get(urlGet, {
            headers: {
                'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNjA2Mjg5MzExfQ.fMPANK7oHpHA6itw0DXPaigG48qHPkgVcTrolOyTZ2o'
            }
        })
        let listData = response.data.map(audio => baseUrlRestore+audio.image)
        var listImage = []
        listData.forEach((value, index)=>{
            if (index >= pageStart && index <= pageEnd)
            listImage.push(value)
        })
        let result = {
            listImage: listImage
        }
        console.log(result)
        await Promise.all(listImage.map(url =>  limit(()=>downloadFile(url, 'public/images/audios'))))
        console.log("limit active", limit.activeCount)
        console.log("success")
        return Promise.resolve("success")
    } catch (err) {
        console.log("erro: ", err)
        return Promise.resolve("error", err)
    }

}

async function restoreImageArtist(baseUrlRestore, pageStart, pageEnd) {
    try {
        let urlGet = baseUrlRestore+"/api/musics/custom"
        let response = await axios.get(urlGet, {
            headers: {
                'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNjA2Mjg5MzExfQ.fMPANK7oHpHA6itw0DXPaigG48qHPkgVcTrolOyTZ2o'
            }
        })
        let listData = response.data.filter(audio => audio.artist !== null)
        listData = listData.map(artist => baseUrlRestore+artist.image)
        var listImageArtist = []
        listData.forEach((value, index)=>{
            if (index >= pageStart && index <= pageEnd)
            listImageArtist.push(value)
        })

        let result = {
            listImageArtist: listImageArtist
        }
        console.log(result)
        await Promise.all(listImageArtist.map(url =>  limit(()=>downloadFile(url, 'public/images/artist'))))
        console.log("limit active", limit.activeCount)
        console.log("success")
    } catch (err) {
        console.log("erro: ", err)
        return Promise.resolve("error", err)
    }

}


async function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        download(url, destination).then(resolve, resolve)
    })
}

module.exports = { restoreAudio , restoreImage, restoreImageArtist}

// async function demo() {
//     let urls = [
//         "https://api-audio-miranto.masyadi.com/audios/5fbcd00d675b412bac18ed610.mp3",
//         "https://api-audio-miranto.masyadi.com/audios/5fbcd00d675b412bac18ed61.mp3"
        
//     ]
//    let promises = urls.map((url) => downloadFile(url, "public/audios"))
//     await Promise.all(promises)
//     console.log("active: ", limit.activeCount)
//     console.log("success")
//     return Promise.resolve("jos")

// }

// demo().then(console.log, console.log)

// restoreAudio()