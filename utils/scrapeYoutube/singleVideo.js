'use strict';

const axios = require("axios").default;
const cheerio = require("cheerio");

async function getSingleVideo(url)
{
    return new Promise(function(resolve, reject)
    {
        axios.get(url).then(async(value)=>{
            var result = await scrapeSingleVideo(value.data);
            resolve(result);
        }).catch((err)=>reject(err))
    })
}

async function scrapeSingleVideo(html)
{
    try{
        // var $ = cheerio.load(html);
        // var result = $('#player').html().split(/videoDetails/)[1];
        // var result = $('#player').html().split("videoDetails")[1].split("playerConfig")[0];
        // var result = $('window["ytInitialPlayerResponse"]').html();
        // var result = html.toString().split('window["ytInitialPlayerResponse"]')[1];
        // result = JSON.stringify(result);

        var start = (html.split('window["ytInitialData"] = ').pop() || '');
        var end = start.split('window["ytInitialPlayerResponse"]').shift();

        // var ini = html.split('window["ytInitialPlayerResponse"]')[1].split('videoDetails')[1];

        var result = JSON.parse("" + end.replace(/;/g, ''));
        result = result.contents.twoColumnWatchNextResults
        
        
        // var result = end;

        // const $ = cheerio.load(html);
        // var pageContainer = $('#page-manager');
        // var url = pageContainer.find("#watch7-content > link:nth-child(1)").attr('href');
        // var thumbnail = pageContainer.find('#watch7-content > link:nth-child(11)').attr('href');
        // var title = pageContainer.html();
        // var channelId = pageContainer.find('#watch7-content > meta:nth-child(5)').attr('content');
        // var videoId = pageContainer.find('#watch7-content > meta:nth-child(6)').attr('content');
        // var uploadDate = pageContainer.find('#watch7-content > meta:nth-child(21)').attr('content');
        // var uploader = pageContainer.find('.yt-user-info > a:nth-child(1)').text().trim();
        // var description = pageContainer.find('#watch-description-text').text().trim();
        // var result ={
        //     title : title,
        //     uploader : uploader,
        //     channelId : channelId,
        //     videoId : videoId,
        //     uploadDate : uploadDate,
        //     url : url,
        //     thumbnail : thumbnail,
        //     description : description,
        // }

        return await Promise.resolve(result);
    }catch(e)
    {
        console.log(e);
        return await Promise.resolve(e);
    }
}

module.exports = {getSingleVideo};