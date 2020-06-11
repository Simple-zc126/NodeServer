var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var tools = require("./tools");
var files_fun = {
    savaPath: '../server/data/',
    write: function (res,name, content,flag,callback) {
        var datapath = path.resolve(this.savaPath+name);
        var flag = flag ? "w" : "a";
        fs.writeFile(datapath, content, { flag: flag, encoding: 'utf8' }, function (err, data) {
            if (err) {
                console.log(err);
                tools.jsonWrite(res, { code: 400, msg: '生成文件失败' });
            } else {
                if(callback){
                    callback(data);
                }
                tools.jsonWrite(res, { code: 999, msg: '系统请求失败' });
            }
        });
    },
    read: function (path,callback) {
        var uploadTmpPath = this.savaPath + path + '.json';
        fs.readFile(uploadTmpPath, "utf8", function (err, data) {
            if (err) {
                console.error('[System] ' + err.message);
                // 关闭文件
                fs.close(uploadTmpPath);
                return false;
            } else {
                if (callback) {
                    callback(data);
                }
                // 关闭文件
                fs.close(uploadTmpPath);
                console.log('file', data);
                return data;
            }
        })
    }
}
module.exports = files_fun; 