const axios = require("axios").default;
const cheerio = require("cheerio");

const getListData = (url) => {
    return new Promise(async (resolve, reject) => {
        try {
            const responseBody = await axios.get(url)
            const $ = cheerio.load(responseBody.data)
            const listAcademy = []
            $('.academy-list-section').find('.new-card-list').each((index, element) => {
                
                var academy = {
                    title: $(element).find('.content-title').text().trim(),
                    thumbnail: $(element).find('.wrapper-kelas > img:nth-child(1)').attr('data-original'),
                    isFree : $(element).find('.ribbon-free').text() ? true : false,
                    totalModul : $(element).find('.remove-style-link > div:nth-child(1) > small:nth-child(1) > span:nth-child(1)').text().trim(),
                    duration : $(element).find('.remove-style-link > div:nth-child(1) > small:nth-child(1) > span:nth-child(2)').text().trim(),
                    level : $(element).find('.remove-style-link > div:nth-child(1) > small:nth-child(1) > span:nth-child(3)').text().trim(),
                    summary : $(element).find('.remove-style-link > div:nth-child(3) > p:nth-child(1)').text().trim(),
                    totalStudentRegister : $(element).find('div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)').text().trim(),
                    url : $(element).find('.remove-style-link').attr('href'),
                }
                listAcademy.push(academy)
            })
            resolve(listAcademy)
        } catch (err) {
            reject(err);
        }
    });
}

const getDetail = (url, data)=>{
    return new Promise(async(resolve, reject) => {
        try{
            const responseBody = await axios.get(url);
            const $ = cheerio.load(responseBody.data)
            var result = {
                ...data,
                imageDetail : $('.fr-dib').attr('src'),
                fullDescription : $('.col-md-8 > div:nth-child(1)').html()
            }
            resolve(result)
        }catch(err){
            reject(err)
        }
    });
}

const getData = (url) =>{
    return new Promise(async(resolve, reject) => {
        try{
            var listData = await getListData(url);
            listData = listData.map((value)=>getDetail(value.url, value))
            var result = await Promise.all(listData)
            resolve(result)
        }catch(err){
            reject(err)
        }
    });
}

// getListData("https://www.dicoding.com/academies/list").then(console.log, console.log)
// getData("https://www.dicoding.com/academies/list").then(console.log, console.log)
// getDetail("https://www.dicoding.com/academies/55").then(console.log, console.log)

module.exports = {getData}