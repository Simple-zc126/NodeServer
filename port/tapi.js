var express = require('express');
var router = express.Router();
var conn = require('./dbfun');//数据库链接
var $sql = require('./sqlfun');//数据库功能
var request = require('request');
var app=express();
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
//访客登记
router.post('/registrationUser', (req, res) => {
    var sql = $sql.app.userlogin;    
    var params = req.body; 
    console.log('req',params.logintype,params.userData,new Date());
    conn.query(sql, [params.logintype,'team',params.userData,new Date()], function(err, result) {    
        if (err) {       
            console.log(err);
        }        
        if (result) {
            jsonWrite(res, result);
            console.log('统计',req.logintype,'用户信息')
        }
    })
});


module.exports = router;