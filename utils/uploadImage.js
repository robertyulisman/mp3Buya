const fs = require('fs');
const sharp = require('sharp');

const uploadImage = (destImage, req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const img = fs.readFileSync(req.file.path)
            const encode_image = img.toString('base64')
            await sharp(new Buffer.from(encode_image, 'base64'))
                .resize(800)
                .toFile(destImage);
            resolve(destImage.replace('public', ''));
        } catch (err) {
            reject(err);
        }
    });
}

const deleteImage = (fileName) => {
    return new Promise((resolve, reject) => {
        try {
            if (!fileName.includes("default-placeholder"))
                fs.unlinkSync(`public${fileName}`);
            resolve("success")
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { uploadImage, deleteImage };