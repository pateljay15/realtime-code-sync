const S3 = require('aws-sdk/clients/s3')
const AWS_ACCESS_KEY = "AKIAYLV3HVFSD5APUZOG"
const AWS_SECRET_KEY = "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"
const AWS_BUCKET_REGION = "ap-south-1"
const AWS_BUCKET_NAME = "encrypt-files-15"
const fs = require("fs")
const path = require("path")


const s3 = new S3({
    region: AWS_BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
})


function uploadFile(file, name) {
    
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Body: file,
        Key: name
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile

function getFileStream(fileKey, key, pa ,cb) {
    // console.log("enter")
    const downloadParams = {
        Key: fileKey,
        Bucket: AWS_BUCKET_NAME
    }
    return s3.getObject(downloadParams, (err, data) => {
        let file = new Buffer.from(data.Body, 'base64')
        // console.log(file)
        // console.log(key)
        // let final = decrypt(file, key)
        // console.log("h", final)
        fs.writeFile(path.join(__dirname, "..", pa), file, (err, file) => {
            if(err) {
                return res.json({ "message": "error" })
            }
            cb()
        })
    })
    // return s3.getObject(downloadParams).createReadStream()
}

exports.getFileStream = getFileStream