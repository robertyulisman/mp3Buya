function formatMusic(listMusic, req) {
    var baseUrl = `${getProtocol(req)}://${req.get('host')}`;
    return listMusic.map((value, index)=>{
        var item = {
            ...value._doc,
            image :  `${baseUrl}${value.image}`,
            url :  `${baseUrl}${value.url}`,
            no : index+=1,
            idByTimestamp: Date.parse(value.createdAt),
            artist: value.artist ? value.artist.name : "unknown",
        }
        delete item.urlDownload
        delete item.__v
        return item
    })
}

function getProtocol (req) {
    return req.protocol == 'http' ? 'https' : 'https' ;
}

module.exports = {formatMusic}