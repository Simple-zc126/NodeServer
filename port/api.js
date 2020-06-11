var express = require('express');
var router = express.Router();
var request = require("../config/request");
var Tools = require("../tools/tools");
var redis = require("../config/redisControl");
var MapControl = require("../tools/map");

//访客登记
router.post('/get', (req, res) => {
    var params = req.body;
    try {
        redis.getUserInfo(params.id,function(value){
            if (value) {
                Tools.jsonWrite(res, { userid: value });
            } else {
                res.status(886).send('System user lost! -- get');
            }
        });
    } catch (e) {
        res.status(886).send('System error!-- get');
    }

    // var url = "http://172.16.0.8:8085/Some/commodity/queryCommodity.do";
    // request.get(url,undefined,function(r,body){
    //     Tools.jsonWrite(res,body);
    // })
});
router.post('/set', (req, res) => {
    var params = req.body;
    try {
        var data = {
            id: params.userid
        }
        data.key = Tools.randomChatAndNumber(9);
        redis.setUserInfo(data);
        var newData = {
            userid: MapControl.set(data.key)
        }

        Tools.jsonWrite(res, newData);

    } catch (e) {
        res.status(886).send('System error!-- set');
    }

    // var url = "http://172.16.0.8:8085/Some/commodity/queryCommodity.do";
    // request.get(url,undefined,function(r,body){
    //     Tools.jsonWrite(res,body);
    // })
});
module.exports = router;
