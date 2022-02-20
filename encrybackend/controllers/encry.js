const crypto = require("crypto")

const algorithm = 'aes-256-ctr'

exports.encrypt = (buffer, key) => {
    if(typeof key !== 'string' || !key) {
        console.log('provide key')
    }

    var isString = typeof buffer === 'string'
    var isBuffer = Buffer.isBuffer(buffer)
    
    var sha256 = crypto.createHash('sha256')
    sha256.update(key)

    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(algorithm, sha256.digest(), iv)

    var buf = buffer
    if(isString) {
        buf = Buffer.from(buffer)
    }

    var cipherText = cipher.update(buf)
    var encrypted = Buffer.concat([ iv, cipherText, cipher.final() ])

    if(isString) {
        encrypted = encrypted.toString('base64')
    }
    
    return encrypted
}


exports.decrypt = (encrypted, key) => {
    if (typeof key !== 'string' || !key) {
        throw new TypeError('Provided "key" must be a non-empty string');
      }
  
      var isString = typeof encrypted === 'string';
      var isBuffer = Buffer.isBuffer(encrypted);
      if (!(isString || isBuffer) || (isString && !encrypted) || (isBuffer && !Buffer.byteLength(encrypted))) {
        throw new TypeError('Provided "encrypted" must be a non-empty string or buffer');
      }
  
      var sha256 = crypto.createHash('sha256');
      sha256.update(key);
  
      var input = encrypted;
      if (isString) {
        input = Buffer.from(encrypted, 'base64');
  
        if (input.length < 17) {
          throw new TypeError('Provided "encrypted" must decrypt to a non-empty string or buffer');
        }
      } else {
        if (Buffer.byteLength(encrypted) < 17) {
          throw new TypeError('Provided "encrypted" must decrypt to a non-empty string or buffer');
        }
      }
  
      // Initialization Vector
      var iv = input.slice(0, 16);
      var decipher = crypto.createDecipheriv(algorithm, sha256.digest(), iv);
  
      var ciphertext = input.slice(16);
  
      var output;
      if (isString) {
        output = decipher.update(ciphertext) + decipher.final();
      } else {
        output = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      }
  
      return output;
}

