
var crypto = require('crypto');
var fs = require('fs');

const PRIVATE_KEY = fs.readFileSync('./key/rsa_private_key.pem');
const PUBLIC_KEY = fs.readFileSync('./key/rsa_public_key.pem');
const KEY = PRIVATE_KEY.toString('utf-8');
const P_KEY = PUBLIC_KEY.toString('utf-8');
// 加密
const ASRcode = function (data) {
    var len = data.length;
    if (len > 86) {
        let dataArray = new Array();
        var l  =len%86==0?parseInt(len / 86):parseInt(len / 86)+1;
        for (let i = 0; i < l; i++) {
            let index = i+1 == l?len:i*86+86;
            let d = data.substring(i*86, index);
            dataArray.push(code(d));
        }
        return dataArray;
    } else {
       return code(data);
    }
};
const code = function(data){
    var len = 86;
    if (data.length<86) {
        len = data.length;
    }
    var buffer = Buffer.alloc(len, data);
    var encrypted = crypto.publicEncrypt( {
        key: P_KEY,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, buffer);
    let encryptedStr = encrypted.toString('base64')
    return encryptedStr;
}
// 解密
const ASRdecode = function (data,key) {
    if (typeof(data) == "object") {
        let arr = new Array();
        data.forEach(e => {
            var d =encode(e);
            arr.push(d);
        });
        return arr.join("");
    }else{
        return encode(data)
    }
};
const encode = function(data){
    var buffer2 = Buffer.alloc(128, data, 'base64')
    try {
        var decrypted = crypto.privateDecrypt(
            {
                key: KEY,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            },
            buffer2
        )
        decrypted = decrypted.toString("utf8")
    } catch (error) {
        console.log("decode fail!");
        var decrypted = "fail";
    }
    
    return decrypted;
}
const RSA = {
    key: P_KEY,
    lock: function (data) {
        return ASRcode(data)
    },
    unlock: function (data) {
        return ASRdecode(data);
    },
    validation: function () {

    }
}
module.exports = RSA;