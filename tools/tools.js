var Tools = {
    //返回数据json化
    jsonWrite: function (res, ret) {
        if (typeof ret === 'undefined') {
            res.json({
                code: '1',
                msg: '操作失败'
            });
        } else {
            res.json(ret);
        }
    },
    //获取用户ip
    getClientIp: function (req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    Trim: function (str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    },
    stringToHex: function (str) {
        var val = "";
        for (var i = 0; i < str.length; i++) {
            if (val == "")
                val = str.charCodeAt(i).toString(16);
            else
                val += "," + str.charCodeAt(i).toString(16);
        }
        return val;
    },
    hexToString: function (str) {
        var val = "";
        var arr = str.split(",");
        for (var i = 0; i < arr.length; i++) {
            var num = parseInt(arr[i], 16);
            val += String.fromCharCode(num);
        }
        return val;
    },
    // Random user password
    randomChatAndNumber: function (length) {
        length = Number(length)
        // Limit length
        if (length < 6) {
            length = 6
        } else if (length > 16) {
            length = 16
        }
        let passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@#$%&*()'];
        var password = [];
        let n = 0;
        for (let i = 0; i < length; i++) {
            // If password length less than 9, all value random
            if (password.length < (length - 4)) {
                // Get random passwordArray index
                let arrayRandom = Math.floor(Math.random() * 4);
                // Get password array value
                let passwordItem = passwordArray[arrayRandom];
                // Get password array value random index
                // Get random real value
                let item = passwordItem[Math.floor(Math.random() * passwordItem.length)];
                password.push(item);
            } else {
                // If password large then 9, lastest 4 password will push in according to the random password index
                // Get the array values sequentially
                let newItem = passwordArray[n];
                let lastItem = newItem[Math.floor(Math.random() * newItem.length)];
                // Get array splice index
                let spliceIndex = Math.floor(Math.random() * password.length);
                password.splice(spliceIndex, 0, lastItem);
                n++
            }
        }
        return password.join("");
    }

}
module.exports = Tools;