const axios = require("axios").default;
const cheerio = require("cheerio");

const getData = (url) =>{
    return new Promise(async(resolve, reject) => {
        try{
            let responseData = await axios.get(url);
            const $ = cheerio.load(responseData.data)
            var list_product = []
            $('.css-rjanld').find('.css-1g20a2m').each((index, element)=>{
                var product = {
                    title : $(element).find('.css-1bjwylw').text().trim(),
                    price : $(element).find('.css-o5uqvq').text().trim(),
                    seller : $(element).find('a:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > span:nth-child(2)').text().trim(),
                    // img : $(element).find('a:nth-child(1)').html()
                }
                list_product.push(product)
            })
            resolve(list_product)
        }catch(err){
            reject(err)
        }
    });
}

// getData("https://www.tokopedia.com/search?st=product&q=dicoding").then(console.log, console.log)