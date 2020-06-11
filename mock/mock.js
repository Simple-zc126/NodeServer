var express = require('express');
var router = express.Router();
var fs = require('fs');
var moment = require('moment');//时间模块
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

//设置文件上传存储路径
app.use(bodyParser.urlencoded({ extended: false }));
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, '../wxserver/upload/')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        var fileName = (file.originalname).split(".")[0];
        cb(null, fileName + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

var uploadDir = '../wxserver/mock/';
var upload = multer({
    dest: '../wxserver/mock/',
    storage: storage
}).array('file');
var uploadUrl = new Array();
// 后台图片上传
router.post('/upload', function (req, res, next) {
    console.log('upload', req.formData);
    //多个文件上传
    upload(req, res, function (err) {
        if (err) {
            console.error('[System] ' + err.message);
        } else {
            var fileList = new Array();
            //循环处理
            var fileCount = req.files.length;
            for (var k = 0; k < fileCount; k++) {
                var imgend = req.files[k].originalname;
                imgend = imgend.substring(imgend.length - 10);
                req.files[k].filename = Date.now() + imgend;
            }
            req.files.forEach(function (i) {
                console.log("执行次数", i);
                //设置存储的文件路径
                var newtime = Date.now();
                var imgend = i.originalname;
                imgend = imgend.substring(imgend.length - 10);
                var uploadFilePath = uploadDir + newtime + imgend;
                fileList.push(newtime + imgend);
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
            var str = {
                code:200,
                msg:"上传成功！"
            }
            str.data = fileList;
            jsonWrite(res, str);
        }
    });
});
router.post('/getData', function (req, res, next){
    //获取页面信息
    getAllData();
    var param = req.body;
    var uploadTmpPath = '../wxserver/mock/' + param.filename;
    fs.readFile(uploadTmpPath, "utf8", function (err, data) {
        if(err){
            console.error('[System] '+err.message);
            var str = {
                code:400,
                msg:err.message
            }
            jsonWrite(res, str);
        }else{
            console.log('file',data);
            var str = {
                code:200,
                msg:"获取成功！"
            }
            str.options = JSON.parse(data); 
            str.time = getDate();
            jsonWrite(res, result);
        }
    })
});
router.post('/getAllData', function (req, res, next){
    //获取页面信息
    getAllData();
    fs.readFile(uploadTmpPath, "utf8", function (err, data) {
        if(err){
            console.error('[System] '+err.message);
            var str = {
                code:400,
                msg:err.message
            }
            jsonWrite(res, str);
        }else{
            console.log('file',data);
            var str = {
                code:200,
                msg:"获取成功！"
            }
            str.options = JSON.parse(data); 
            str.time = getDate();
            jsonWrite(res, result);
        }
    })
});

function getAllData(){
    var path = "./mock";
    if(!fs.existsSync(path)){
        console.log("路径不存在");
        return "路径不存在";
    }
    var info=fs.statSync(path);
    if(info.isFile()){
        console.log("flis name",info);
        return info;
    }
}
//返回数据json化
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};
//获取系统时间
var getDate = ()=>{
    moment.locale('zh-cn');
    let getDate = {}
    let _today = moment();
    let endDate = moment().add(1,'y');
    getDate.selectdate = _today.format('YYYY-MM-DD'); /*现在的时间*/
    getDate.startDate = _today.format('YYYY-MM-DD'); /*现在的时间*/
    getDate.endDate = endDate.format('YYYY-MM-DD'); /*现在的时间*/
    return getDate;
}
module.exports = router;        