const File = require("../models/file")
// const formidable = require("formidable")
const fs = require("fs")
const path = require("path")

const crypto = require("crypto")
// const { encrypt, decrypt, encryptString } = require("./encryption")
const { encrypt, decrypt } = require("./encry")
const { uploadFile, getFileStream } = require("./aws-upload")

exports.uploadFile = (req, res) => {
    let name = req.file.originalname
    let opath = req.file.path
    let contentType = req.file.mimetype
    let AWS_KEY = ""
    let mainKey = req.body.key
    let random = crypto.randomBytes(32)
    let key = random.toString('hex', 0, 16)
    let fileEncryKey = "";
    let keyPath = path.join(__dirname, "..", "keys", name.split(".")[0] + '.txt')
    fs.readFile(path.join(__dirname, "..", opath), (err, file) => {
        if(file) {
            let cipherText = encrypt(file, key)
            fileEncryKey = encrypt(key, mainKey)
            fs.writeFile(keyPath, fileEncryKey, (err, file) => {
                if(err) {
                    console.log(err)
                }
            })
            fs.writeFile(path.join(__dirname, "..", opath), cipherText, (err, file) => {
                if(err) {
                    return res.json({ "message": "error" })
                }
                uploadFile(cipherText, name)
                .then(data => {
                    console.log(data)
                    AWS_KEY = data.Key
                    const upload = File({
                        name: name,
                        file: {
                            path: opath,
                            contentType: contentType,
                            AWSKEY: AWS_KEY
                        },
                        uploadBy: req.profile,
                        accessList: [ req.profile ]
                    })
                    fs.unlink(path.join(__dirname, "..", opath), (err) => {
                        if(err) {
                            console.log(err)
                        }
                    })
                    upload.save()
                    .then(file => res.json(file))
                    .catch(err => console.log(err))
                }).catch(err => console.log(err))
            })
        }
    })
    // console.log(fileEncryKey) 
}

exports.getFile = (req, res, next) => {
    let file;
    let id = req.params.fileId
    // console.log(req.params.fileId)
    // console.log(req.params.key)
    File.findById(id).exec()
    .then(f => {
        file = f
        // console.log("j",f)
        if(file.file.path) {
            // console.log("b", file)
            let keyPath = path.join(__dirname, "..", "keys", file.name.split(".")[0] + '.txt')
                fs.readFile(keyPath, (err, keyf) => {
                    keyf = keyf.toString()
                    // console.log(req.key)
                    let key = decrypt(keyf, req.params.key)
                    getFileStream(file.file.AWSKEY, key, file.file.path, () => {
                        fs.readFile(path.join(__dirname, "..", file.file.path), (err, final) => {
                            let plainText = decrypt(final, key)
                            fs.unlink(path.join(__dirname, "..", file.file.path), (err) => {
                                if(err) {
                                    console.log(err)
                                }
                            })
                            // console.log(plainText)
                            res.set('Content-Type', file.file.contentType)
                            res.setHeader('Content-Disposition', 'attachment; filename="' + file.name + '"')
                            // file.pipe(res)
                            res.send(plainText)
                        })
                    })
                })
        }
    }).catch((err) => {
        if(err == null) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
    })
}

// exports.getFile = (req, res, next) => {
//     console.log(req.file)
//     if(req.file.file.path) {
//         let keyPath = path.join(__dirname, "..", "keys", req.file.name.split(".")[0] + '.txt')
//             fs.readFile(keyPath, (err, keyf) => {
//                 keyf = keyf.toString()
//                 // console.log(req.k)
//                 let key = decrypt(keyf, req.k)
//                 getFileStream(req.file.file.AWSKEY, key, req.file.file.path, () => {
//                     fs.readFile(path.join(__dirname, "..", req.file.file.path), (err, file) => {
//                         let plainText = decrypt(file, key)
//                         fs.unlink(path.join(__dirname, "..", req.file.file.path), (err) => {
//                             if(err) {
//                                 console.log(err)
//                             }
//                         })
//                         res.set('Content-Type', req.file.file.contentType)
//                         res.setHeader('Content-Disposition', 'attachment; filename="' + req.file.name + '"')
//                         // file.pipe(res)
//                         res.send(plainText)
//                     })
//                 })
//                 // console.log(file)
//                 // let plainText = decrypt(file, key)
//                 // res.set('Content-Type', req.file.file.contentType)
//                 // res.setHeader('Content-Disposition', 'attachment; filename="' + req.file.name + '"')
//                 // // file.pipe(res)
//                 // res.send(file)
//             })
//     }
// }


// exports.getFile = (req, res, next) => {
//     if(req.file.file.path) {
//         fs.readFile(path.join(__dirname, "..", req.file.file.path), (err, file) => {
//             // let key = decrypt(req.file.file.key, mainKey)
//             let keyPath = path.join(__dirname, "..", "keys", req.file.name.split(".")[0] + '.txt')
//             fs.readFile(keyPath, (err, keyf) => {
//                 keyf = keyf.toString()
//                 console.log(req.k)
//                 console.log("b", file)
//                 let key = decrypt(keyf, req.k)
//                 console.log("k", key)
//                 let plainText = decrypt(file, key)
//                 console.log("p", plainText)
//                 res.set('Content-Type', req.file.file.contentType)
//                 res.setHeader('Content-Disposition', 'attachment; filename="' + req.file.name + '"')
//                 res.send(plainText)
//             })
//         })
//     }
// }

// exports.getFileById = (req, res, next, id) => {
//     File.findById(id, (err, file) => {
//         if(err) {
//             return res.status(400).json({
//                 error: "Product not found"
//             })
//         }
//         console.log(file)
//         req.file = file
//         req.k = req.params.key
//         next()
//     })
// }