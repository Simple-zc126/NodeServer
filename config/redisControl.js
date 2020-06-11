var Redis = require('ioredis')
var map = require("../tools/map");
var redis = {
    redis: undefined,
    init: function () {
        this.redis = new Redis({
            port: 6379,          // Redis port
            host: '127.0.0.1',   // Redis host
            family: 4,           // 4 (IPv4) or 6 (IPv6)
            password: '112233',
            db: 0
        })
    },
    get: function (id, cellback) {
        if (this.redis) {
           this.redis.get(id, (err, value) => {
                if (err) {
                    console.log('make order get redis error:', err)
                } else {
                    if (value == undefined) {
                        return false;
                    } else {
                        if (cellback) {
                            cellback(value);
                        }
                        return value;
                    }
                }
            });
        }else{
            console.log("redis error not find redis")
        }
    },
    set: function (id, value, timeout) {
        if (timeout) {
            this.redis.set(id, value);
            this.redis.expire(id, timeout);
        } else {
            this.redis.set(id, value);
        }
    },
    getUserInfo:function(key,cellback){
        var id = map.get(key);
        if (id.length != 0) {
            this.get(id,function(value){
                cellback(value)
            });
        }else{
            return false;
        }

    },
    setUserInfo:function(data){
        var value = data.id;
        var key = data.key;
        console.log("set",key)
        this.set(key,value)
    }
}
module.exports = redis; 
