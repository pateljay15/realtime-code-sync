const crypto = require("crypto")

const algorithm = 'aes-256-ctr'

exports.encrypt = (buffer, key) => {

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    const result = Buffer.concat([ iv, cipher.update(buffer), cipher.final() ])
    return result
}

exports.encryptString = (buffer, key) => {

    // console.log(typeof buffer)
    // buffer = Buffer.from(buffer, "hex")
    console.log(buffer)

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    const result = Buffer.concat([ iv, cipher.update(buffer, 'utf-8', 'hex'), cipher.final('hex') ])
    return result
}

exports.decrypt = (buffer, key) => {
    
    const iv = buffer.slice(0, 16)
    
    buffer = buffer.slice(16)

    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    const result = Buffer.concat([ decipher.update(buffer), decipher.final() ])
    return result
} 

exports.decryptString = (buffer, key) => {
    
    const iv = buffer.slice(0, 16)
    
    buffer = buffer.slice(16)

    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    const result = Buffer.concat([ decipher.update(buffer, 'utf-8', 'hex'), decipher.final('hex') ])
    return result
} 