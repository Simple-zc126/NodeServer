
var request = require('request');
var req = {
    get: function (url, other,callback) {
        var option = {
            uri: url,
        }
        for (const key in other) {
            if (other.hasOwnProperty(key)) {
                const e = other[key];
                option[key] = e;
            }
        }
        request.get(option, (err, res, body) => {
            if (err) {
                console.log(err)
                return false;
            }
            console.log(body)
            if (body.errcode) {
                // 返回错误时的处理
                console.log("请求token错误！");
                return false;
            } else {
                if (callback) {
                    callback(res, body);
                }else{
                    return body;
                }
            }
        })
    },
    post: function (url, data, callback) {
        request.post({
            uri: url,
            json: true,
            data: data
        }, (err, res, body) => {
            if (err) {
                console.log(err)
                return false;
            }
            console.log(body)
            if (body.errcode) {
                // 返回错误时的处理
                console.log("请求token错误！");
                return false;
            } else {
                if (callback) {
                    callback(res, body);
                }else{
                    return body;
                }
            }
        })
    }
}
module.exports = req;