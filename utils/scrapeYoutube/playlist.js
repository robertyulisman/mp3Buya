'use strict';

const axios = require("axios").default;
const cheerio = require("cheerio");

const getDataPlaylist = (url) =>{
    return new Promise(async(resolve, reject) => {
        try {
            var response = await axios.get(url);
            var start = (response.data.split('var ytInitialData =').pop() || '');
            start = start.split('</script>')[0]
            var result = JSON.parse(start.replace(/(\r\n|\n|\r)/gm, "").replace(';', ""))
            result = result
                .contents
                .twoColumnBrowseResultsRenderer
                .tabs[0]
                .tabRenderer
                .content
                .sectionListRenderer
                .contents[0]
                .itemSectionRenderer
                .contents[0]
                .playlistVideoListRenderer
                .contents

            result = result.map((value)=>{
                // if(value.playlistVideoRenderer && value.playlistVideoRenderer.lengthText && value.playlistVideoRenderer.lengthText.simpleText){
                //     var item = {
                //         videoId : value.playlistVideoRenderer.videoId,
                //         thumbnail : value.playlistVideoRenderer.thumbnail.thumbnails[value.playlistVideoRenderer.thumbnail.thumbnails.length-1].url.replace('hqdefault', 'maxresdefault'),
                //         title : value.playlistVideoRenderer.title.runs[0].text.trim(),
                //         duration :  value.playlistVideoRenderer && value.playlistVideoRenderer.lengthText && value.playlistVideoRenderer.lengthText.simpleText,
                //     }
                //     return item
                // }
                if(value.playlistVideoRenderer){
                    var item = {
                        videoId : value.playlistVideoRenderer.videoId,
                        thumbnail : value.playlistVideoRenderer.thumbnail.thumbnails[value.playlistVideoRenderer.thumbnail.thumbnails.length-1].url,
                        title : value.playlistVideoRenderer.title.runs[0].text.trim(),
                        duration :  value.playlistVideoRenderer && value.playlistVideoRenderer.lengthText && value.playlistVideoRenderer.lengthText.simpleText || "tidak diketahui",
                    }
                    return item
                } else {
                    return item = {
                        videoId : "",
                        thumbnail : "",
                        title : "",
                        duration :  "",
                    }
                }
               
            })
            resolve(result)
        } catch (error) {
            console.log("error : ", error)
            reject(error);
        }
    });
}

module.exports = {getDataPlaylist};

