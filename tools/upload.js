const bodyParser = require('body-parser');
const express = require('express');
const app = express();
var multer = require('multer');
var fs = require('fs');

//设置文件上传存储路径
app.use(bodyParser.urlencoded({ extended: false }));
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, '/upload/')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        var fileName = (file.originalname).split(".")[0];
        cb(null, fileName + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var uploadDir = '../dist/static/';
var upload = multer({
    dest: '/upload/',
    storage: storage
}).array('file');
var upload = {
    upload: function () {
        //多个文件上传
        upload(req, res, function (err) {
            if (err) {
                console.error('[System] ' + err.message);
            } else {
                var fileList = new Array();
                //循环处理
                var fileCount = req.files.length;
                for (var k = 0; k < fileCount; k++) {
                    req.files[k].filename = new Date().getTime() + req.files[k].originalname
                }
                req.files.forEach(function (i) {
                    console.log("执行次数", i);
                    //设置存储的文件路径
                    var newtime = new Date().getTime();
                    var uploadFilePath = uploadDir + newtime + i.originalname;
                    fileList.push(newtime + i.originalname);
                    //获取临时文件的存储路径
                    var uploadTmpPath = i.path;
                    //读取临时文件
                    fs.readFile(uploadTmpPath, function (err, data) {
                        if (err) {
                            console.error('[System] ' + err.message);
                        } else {
                            //读取成功将内容写入到上传的路径中，文件名为上面构造的文件名
                            fs.writeFile(uploadFilePath, data, function (err) {
                                if (err) {
                                    console.error('[System] ' + err.message);
                                } else {
                                    //写入成功,删除临时文件
                                    fs.unlink(uploadTmpPath, function (err) {
                                        if (err) {
                                            console.error('[System] ' + err.message);
                                        } else {
                                            console.log('[System] ' + 'Delete ' + uploadTmpPath + ' successfully!');
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                //所有文件上传成功
                console.log("filelist", fileList);
                var uploadfilelist = new Array();
                for (var a = 0; a < fileList.length; a++) {
                    uploadfilelist[a] = "/static/" + fileList[a];
                }
                //回复信息
                var reponse = {
                    message: "sucssful!!"
                };
                //存入数据库
                var sql = $sql.admin.shopimglist;
                conn.query(sql, [
                    uploadfilelist[0],
                    uploadfilelist.join("|"),
                    req.body.itid], function (err, result) {
                        if (err) {
                            console.log(err);
                        } else if (result) {
                            console.log("sucsseeful!!");
                        }
                    });
                //返回
                res.end(JSON.stringify(reponse));
            }
        });
    }
}
