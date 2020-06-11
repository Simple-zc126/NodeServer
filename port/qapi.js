var express = require('express');
var router = express.Router();
var conn = require('./dbfun');//数据库链接
var $sql = require('./sqlfun');//数据库功能
var moment = require('moment');//时间模块
var request = require('request');
var WXBizDataCrypt = require('./WXBizDataCrypt')//微信解密算法
var app=express();
var multer = require('multer');
var fs = require('fs');
var bodyParser=require('body-parser');
const schedule = require('node-schedule');
var crypto = require('crypto');//加密算法
var urlencode = require('urlencode');//urlcode
const  scheduleCronstyle = ()=>{
  //每分钟的第30秒定时执行一次:
  console.log('投票限制开启')
    schedule.scheduleJob('30 1 1 * * *',()=>{
        console.log('已经删除投票限制:' + new Date());
        delPath("./pics/taday");  //确认路径。__ 。没有后悔药
    }); 
}
//定时删除投票限制
scheduleCronstyle();
function delPath(path){
    console.log('删除文件')
    // if(path.indexOf('./')!==0||path.indexOf('../')!==0){
    //     console.log('安全限制')
    //     return "为了安全仅限制使用相对定位..";
    // }
    if(!fs.existsSync(path)){
        console.log("路径不存在");
        return "路径不存在";
    }
    var info=fs.statSync(path);
    if(info.isDirectory()){//目录
        var data=fs.readdirSync(path);
        if(data.length>0){
            for (var i = 0; i < data.length; i++) {
                delPath(`${path}/${data[i]}`); //使用递归
                if(i==data.length-1){ //删了目录里的内容就删掉这个目录
                    delPath(`${path}`);
                }
            }
        }else{
            //fs.rmdirSync(path);//删除空目录
        }
    }else if(info.isFile()){
        fs.unlinkSync(path);//删除文件
    }
}



//设置文件上传存储路径
app.use(bodyParser.urlencoded({extended:false}));
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
var uploadDir='../wxserver/pics/';
var upload = multer({
    dest: '../wxserver/upload/',
    storage: storage
}).array('file');
var uploadUrl=new Array();
// 后台图片上传
router.post('/upload', function(req, res, next){
    console.log('upload',req.formData);
    //多个文件上传
    upload(req,res,function(err){
        if(err){
            console.error('[System] ' + err.message);
        }else{
        	var fileList=new Array();
            //循环处理
            var fileCount=req.files.length;
              for(var k=0;k<fileCount;k++){
                var imgend =  req.files[k].originalname;
                imgend = imgend.substring(imgend.length-10);
              	req.files[k].filename = Date.now()+imgend;
              }
             req.files.forEach(function(i){
             	console.log("执行次数",i);
                 //设置存储的文件路径
                 var newtime =Date.now();
                 
                 var imgend =  i.originalname;
                imgend = imgend.substring(imgend.length-10);
                var uploadFilePath=uploadDir+newtime+imgend;
                fileList.push(newtime+imgend);
                 //获取临时文件的存储路径
                 var uploadTmpPath=i.path;
                 //读取临时文件
                 fs.readFile(uploadTmpPath,function(err,data){
                     if(err){
                         console.error('[System] '+err.message);
                     }else{
                         //读取成功将内容写入到上传的路径中，文件名为上面构造的文件名
                         fs.writeFile(uploadFilePath,data,function(err){
                             if(err){
                                 console.error('[System] '+err.message);
                             }else{
                                 //写入成功,删除临时文件
                                 fs.unlink(uploadTmpPath,function(err){
                                     if(err){
                                         console.error('[System] '+err.message);
                                     }else{
                                         console.log('[System] '+'Delete '+uploadTmpPath+' successfully!');
                                         
                                     }
                                 });
                             }
                         });
                     }
                 });
            });
            //所有文件上传成功
            console.log("filelist",fileList);
            //回复信息
            var reponse={
                message:"sucssful!!",
                code : 200
            };
                //存入暂存url数据中
                var params = req.body;
                var sql = $sql.wxapp.question.makeOrderSavepicsupload;    
                console.log('uploaddate',params)
                conn.query(sql, ["|"+fileList[0],params.uopenid,params.idx], function(err, result) {    
                    if (err) {       
                        console.log(err);
                    }        
                    if (result) {
                        console.log('savaupload',result);
                        jsonWrite(res, reponse);
                    }
                })
            //返回
            //res.end(JSON.stringify(reponse));
        }
    });
});


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
//获取系统事件
router.post('/getDate',(req,res)=>{
    moment.locale('zh-cn');
    let getDate = {}
    let _today = moment();
    let endDate = moment().add(1,'y');
    getDate.selectdate = _today.format('YYYY-MM-DD'); /*现在的时间*/
    getDate.startDate = _today.format('YYYY-MM-DD'); /*现在的时间*/
    getDate.endDate = endDate.format('YYYY-MM-DD'); /*现在的时间*/
    console.log('getDate',getDate);
    jsonWrite(res, getDate);
})
//访客登记
router.post('/registrationUser', (req, res) => {
    var sql = $sql.app.userlogin;    
    var params = req.body; 
    conn.query(sql, [params.logintype,'wxapp','question',params.userData,new Date()], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            console.log('统计',req.logintype,'用户信息')
        }
    })
});
//获取用户openid
var APP_ID="wxf205e7a03baf1383";
var APP_SECRET="a059b6e2fdec243af609276febd517dc";
const SKEY = "fkm";
//openid 随机key值
function createRandomKey() {
  return (Math.random()*10000000).toString(16).substr(0,4)+''+Date.now()+''+Math.random().toString().substr(2,5);
}

//uopenid加密
function cipher(algorithm, key, buf){
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'binary', 'hex');
    encrypted += cip.final('hex');
    console.log('加密后',encrypted)
    return encrypted;
}
//uopenid解密
function decipher(algorithm, key, encrypted){
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');
    console.log('解密后',decrypted);
    return decrypted;
}

   
  
//获取openid
router.post('/getUserOpenid', (req, res) => {   
    var params = req.body; 
    let key = createRandomKey();
    let uopenid = "";
    // var encryptedData = params.encryptedData;
    // var iv = params.iv;
    // var pc = new WXBizDataCrypt(appId, sessionKey)
    // var data = pc.decryptData(encryptedData , iv)
    // console.log('解密后 data: ', data) 
	var url="https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code";
		url = url.replace("APPID",APP_ID);
		url = url.replace("SECRET",APP_SECRET);
		url = url.replace("JSCODE",params.code);
	request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        console.log("openid",body);
        var openid = urlencode(body.openid, 'gbk');
        uopenid = cipher('aes-256-cbc',key,openid);
        //jsonWrite(res, body); 
        var sql = $sql.wxapp.question.saveUser;    
        conn.query(sql, [uopenid,body.openid,body.session_key,key], function(err, result) {    
            if (err) {       
                console.log(err);
            }        
            if (result) {
                var useropenid ={};
                useropenid.code = '200';
                useropenid.uopenid = cipher('aes-256-cbc',SKEY,key);
                console.log('uopenid',useropenid);
                jsonWrite(res, useropenid);
            }
        })
    }else{
        var str = {
            code: 100,
            msg: '获取用户信息失败！'
        }
        jsonWrite(res, str);
    }
	});
});
//更新热度列表
router.post('/updateHotList', (req, res) => {
    var sql1 = $sql.wxapp.question.hotlist;
    var params = req.body; 
    conn.query(sql1, [params.uopenid],function(err, result1) {
        if (err) {       
            console.log('mainlist err',err);
        }
        if (result1) {
            var str = {};
            str.hotorder = result1;
            jsonWrite(res, str);
        }
    })
});
//主页列表
router.post('/QmainList', (req, res) => {
    var sql = $sql.wxapp.question.mainList;    
    var sql1 = $sql.wxapp.question.hotlist;
    var params = req.body; 
    console.log('mainlist',params.uopenid);
    var str = {};
    conn.query(sql1, [params.uopenid],function(err, result1) {    
        if (err) {       
            console.log('mainlist err',err);
        }        
        if (result1) {
            console.log('hotlist res',result1);
            str.hotorder = result1;
            conn.query(sql, [params.uopenid], function(err, result2) {    
                if (err) {       
                    console.log('mainlist err',err);
                }        
                if (result2) {
                    console.log('mainlist res',result2);
                    str.myList = result2;
                    jsonWrite(res, str);
                }
            })
        }
    })
    
});
//删除订单
router.post('/delOrder', (req, res) => {
    var sql = $sql.wxapp.question.delOrder;    
    var params = req.body; 
    console.log('delOrder',params.uopenid,params.idx);
    conn.query(sql,[params.uopenid,params.idx], function(err, result) {  
        if (err) {       
            console.log('delOrder err',err);
            jsonWrite(res, result);
        }        
        if (result) {
            console.log('delOrder res',result);
            jsonWrite(res, result);
        }  
    })
    
});
//存储失败 删除此行
function saveErrorDel(uopenid,idx){
    var sql = $sql.wxapp.question.delOrder;
    conn.query(sql,[uopenid,idx], function(err, result) {  
        if (err) {       
            console.log('delOrder err',err);
            jsonWrite(res, result);
        }        
        if (result) {
            console.log('delOrder res',result);
            jsonWrite(res, result);
        }  
    })
}
//提交订单
router.post('/makeOrder', (req, res) => {
    var sql = $sql.wxapp.question.makeOrderUsermsg; 
    var sql2 = $sql.wxapp.question.makeOrderSavepics;
    var sql3 = $sql.wxapp.question.makeOrderOptions;
    var params = req.body; 
    var usermsg = params.msgdata.usermsg;
    var options = params.msgdata.options;
    var orid = params.uopenid+Date.now();
    var savaJsonFspath = '../wxserver/pics/jsonfs/';
    var content ={};
    content.user = usermsg;
    content.options = options;
    console.log('makeOrder content',content);
    content = JSON.stringify(content);
    fs.writeFile(savaJsonFspath+orid+'.json', content, {encoding: 'utf8'}, function (err, data) {
        if(err) {
         console.log(err);
         jsonWrite(res, {code: 400,msg: '生成文件失败'});
        }else{
    conn.query(sql,[params.uopenid,orid,usermsg.username,usermsg.email,usermsg.title,usermsg.overtime], function(err, result) {  
        if (err) {       
            console.log('makeOrder1 err',err);
            jsonWrite(res, result);
        }        
        if (result) {
                    conn.query(sql2,[params.uopenid,orid], function(err, result1) {  
                        if (err) {       
                            console.log('makeOrder2 err',err);
                            saveErrorDel(params.uopenid,orid);
                            jsonWrite(res, result1);
                        }        
                        if (result1) {
                            console.log('makeOrder res',result1);
                            var opts = options;
                            for (let k = 0; k < opts.length; k++) {
                               var json = opts[k];
                               delete json.title;
                               delete json.radio; 
                                for (let j = 0; j < json.opt.length; j++) {
                                    delete json.opt[j].value;
                                }
                                
                            }
                            opts = JSON.stringify(opts);
                            conn.query(sql3,[params.uopenid,orid,opts], function(err, result2) {
                                if (err) {       
                                    console.log('makeOrder2 err',err);
                                    saveErrorDel(params.uopenid,orid);
                                    jsonWrite(res, result1);
                                }        
                                if (result2) {
                                    let str = {
                                        code: 100,
                                        uopenid : params.uopenid,
                                        idx : orid
                                    }
                                    jsonWrite(res, str);
                                }
                            })
                            
                        }  
                    })
        }  
    })}
    });    
});

//获取页面信息
router.post('/getContent', (req, res) => {
    var sql = $sql.wxapp.question.getContent; 
    var sql1 = $sql.wxapp.question.getPics; 
    var sql2 = $sql.wxapp.question.getOptions; 
    var params = req.body; 
    console.log('getContent',params.idx);
    conn.query(sql, [params.idx], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            let str={};
            conn.query(sql1, [params.idx], function(err, result1) {    
                if (err) {       
                    console.log(err);
                    jsonWrite(res, result);
                }        
                if (result1) {
                    str.pics = result1
                    var uploadTmpPath = '../服务端/pics/jsonfs/'+params.idx+'.json';
                    fs.readFile(uploadTmpPath,"utf8",function(err,data){
                        if(err){
                            console.error('[System] '+err.message);
                            jsonWrite(res, result);
                        }else{
                            console.log('file',data);
                            str.options = JSON.parse(data); 
                            conn.query(sql2,[params.uopenid,params.idx], function(err, result2) {  
                                if (err) {       
                                    console.log('getContent err',err);
                                    jsonWrite(res, result);
                                }        
                                if (result2) {
                                    console.log('getContent res',result2);
                                    str.optionsnum = result2;
                                    jsonWrite(res, str);
                                }  
                            })
                            
                        }
                    })
                }
            })
            
        }
    })
});
//今日投票限制
router.post('/todaySubed', (req, res) => {   
    var params = req.body; 
    var uploadTmpPath = '../服务端/pics/taday/'+params.idx+'.txt';
    fs.readFile(uploadTmpPath,"utf8",function(err,data){
        if(err){
            console.error('[System] '+err.message);
            fs.writeFile(uploadTmpPath, params.uopenid+'|', {encoding: 'utf8'}, function (err, data1) {
                if(err){
                    var str = {
                        code:500,
                        msg: '投票失败！ 501'
                    }
                    jsonWrite(res, str); 
                }else{
                    var str = {
                        code: 200,
                        msg: '可以投票！'
                    }
                    jsonWrite(res, str);
                }
            })
        }else{
            console.log('file',data);
            let cont = data.split('|');
            for (let i = 0; i < cont.length; i++) {
                const e = cont[i];
                if(params.uopenid == e){
                    var str = {
                        code:501,
                        msg: '今日已经投过啦！'
                    }
                    jsonWrite(res, str);
                    return;
                }
            }
                    fs.appendFile(uploadTmpPath, params.uopenid+'|', function (err) {
                        if(err){
                            console.log('追加内容失败');
                        }else{
                            console.log('追加内容完成');
                            var str = {
                                code: 200,
                                msg: '可以投票！'
                            }
                            jsonWrite(res, str);
                        }
                    });
            
        }
    })
    
});
//提交投票
router.post('/submitOrder', (req, res) => {
    var sql = $sql.wxapp.question.getOptions;   
    var params = req.body; 
    console.log('submitOrder',params.uopenid,params.idx,params.options);
    conn.query(sql,[params.uopenid,params.idx], function(err, result) {  
        if (err) {       
            console.log('submitOrder err',err);
            jsonWrite(res, result);
        }        
        if (result) {
            console.log('submitOrder res',result);
            var options = params.options;
            console.log('new options', options);
            
                var newoptions = setSubOption(options,result);
                if (newoptions == "null") {
                    var str ={
                        code: 500,
                        msg: '问卷出错！'
                    };
                }
                savaOrdersub(res,params.uopenid,params.idx,newoptions);
                
        }else{
            var str ={
                code: 500,
                msg: '没找到问卷 或 问卷已经被删除！'
            };
            jsonWrite(res, str);
        }  
    })
});
function setSubOption(options,oldoptions){
    //oldoptions = JSON.parse(oldoptions);
    console.log('options',options,oldoptions);
    if (oldoptions.length == 0) {
        return 'null';
    }
    oldoptions = oldoptions[0].options;
    oldoptions = JSON.parse(oldoptions);
    console.log('oldoptions',oldoptions);
    for (let i = 0; i < oldoptions.length; i++) {
       
        for (let k = 0; k < options.length; k++) {
          
            if(oldoptions[i].idopt == options[k].optid){
                arr = oldoptions[i].opt;
                if(typeof(options[k].opt) == 'number'){
                    console.log('单选')
                    for (let j = 0; j < arr.length; j++) {
                       if(arr[j].i == options[k].opt){
                           console.log('in')
                           oldoptions[i].opt[j].num = oldoptions[i].opt[j].num+1;
                       }
                    }
                    
                }else{
                    console.log('多选')
                    var str = options[k].opt;
                    if(options[k].opt == null){
                        console.log('in null')
                        break;
                    }
                    for (let n = 0; n < str.length; n++) {
                        for (let m = 0; m < arr.length; m++) {
                           if(str[n] == arr[m].i){
                            console.log('in')
                            oldoptions[i].opt[m].num = oldoptions[i].opt[m].num+1;
                           }
                        }
                    }
                    
                } 
            }
        }
        console.log('sub opt',JSON.stringify(oldoptions[i].opt));
        oldoptions[i].opt = JSON.stringify(oldoptions[i].opt);
    }
    console.log('sub',oldoptions);
    return oldoptions;
};
function savaOrdersub(res,uopenid,idx,options){
    var sql = $sql.wxapp.question.updeteOptions;   
    for(var i in options){
        options[i].opt = JSON.parse(options[i].opt);
    }
    options = JSON.stringify(options);
    console.log('save options',options);
    conn.query(sql,[options,uopenid,idx], function(err, result) {  
        if (err) {       
            console.log('submitOrder err',err);
            var str ={
                code: 501,
                msg: '投票失败！'
            };
            jsonWrite(res, str);
        }        
        if (result) {         
            console.log('submitOrder res',result);
            if(result.affectedRows == 1){
                    var str = {
                        code: 200,
                        msg: '投票成功！'
                    }
                    jsonWrite(res, str);
            }
           
        }  
    }) 
}
function URLencode(sStr) 
{ 
return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g,'%22') 
.replace(/\'/g, '%27').replace(/\//g,'%2F'); 
} 
module.exports = router;