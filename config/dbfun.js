var models = require('./db');
var mysql = require('mysql');
const schedule = require('node-schedule');
// 连接数据库
var conn = '';
connFun();
function connFun(){
    conn = mysql.createPool(models.mysql);  
	conn.getConnection(function(err,conn){ 
        if(err){  
            console.log('db error',err)
            callback(err,null,null);  
        }else{  
            console.log('db successed')
            conn.release();  
               
        }  
    });
}
module.exports = conn;