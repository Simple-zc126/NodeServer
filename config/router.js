//filter
var express = require('express');
const config = require('./config');
const decode = require("../tools/decode");
const Systemlog = require("../logs/systemlogs/systemlogs");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
var router = {
    routerMap: config.routerMap,
    path: config.staticFilePath,
    report: config.port,
    all: function () {
        let _this =  this;
        app.all('*', (req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Credentials","true");
            res.header("X-Powered-By", ' 3.2.1');
            res.header("Content-Type", "application/json;charset=utf-8");
            console.log(req.headers);
            if (req.headers.ck != undefined) {
                if (req.headers.ck == "init") {
                    res.header("ck", "123");
                } else {
                    res.header("ck", req.headers.ck);
                }
                try {
                    next();
                } catch (error) {
                    Systemlog.print(res,error,req.headers.ck,_this.getClientIP(req));
                }
            } else {
                res.status(886).send('System error!');
            }
        }, (req, res, next) => {
            let openid = req.headers.openid;
            if (openid) {
                openid = decode.unlock(openid);
                if (openid == "fail") {
                    res.status(886).send('System user lost!');
                }
            } else {
                next()
            }
        });
        
       
    },
    specifiedRouter: function (url, callback) {
        app.all('/' + url + '/*', (req, res, next) => {
            let isOver = false;
            if (callback) {
                isOver = callback();
            }
            if (!isOver) {
                next();
            } else {
                res.status(999).send('Request irregularities!');
            }
        });
    },
    getClientIP:function(req) {
        return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
    },
    InitRouters: function () {
        this.routerMap.forEach(router => {
            app.use(router.url, router.api);
        });
    },
    init: function () {
        let _this = this;
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        // 访问静态资源文件 这里是访问所有dist目录下的静态资源文件
        let staticPath = __dirname.replace("\config", "");
        app.use(express.static(path.resolve(staticPath, _this.path)));
        app.listen(_this.report);
        console.log('success listen at port:' + _this.report + '......');
        _this.all();
        _this.InitRouters();
    }
}
module.exports = router;


