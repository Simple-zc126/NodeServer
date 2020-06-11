// node 后端服务器
const router = require('./config/router');
const wx = require('./wx_fun/wechat');
const redis = require('./config/redisControl');
//初始化路由
router.init();
//初始化微信
//wx.init();
//初始化redis
redis.init();