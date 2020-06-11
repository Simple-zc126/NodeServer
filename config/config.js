
const mallApi = require('../port/api');
// const mockApi = require('../port/qapi');
// const teamApi = require('./tapi');
// const redisApi = require('./redisDemo');
const CONF = {
    port: '8088',
    rootPathname: '',
    // routerMap:[{
    //     url: 'mall',
    //     api: mallApi
    // },
    // {
    //     url: '/mock',
    //     api: mockApi
    // }],
    routerMap:[
        {
            url: '/mall',
            api: mallApi
        }
    ],
    //静态文件地址
    staticFilePath:"upload",
    //decodeKey
    codeKey:"123",
    // 微信小程序 App ID
    appId: '',
    // 微信小程序 App Secret
    appSecret: '',
    // 微信小程序 accesstoken
    token:'',
    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: true,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '云数据库内网IP',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: '云数据库密码',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 区域
         * 华北：cn-north
         * 华东：cn-east
         * 华南：cn-south
         * 西南：cn-southwest
         * 新加坡：sg
         * @see https://cloud.tencent.com/document/product/436/6224
         */
        region: 'cn-south',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,

    // 其他配置 ...
    serverHost: '你的域名',
    tunnelServerUrl: 'http://tunnel.ws.qcloud.la',
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    qcloudAppId: '你的腾讯云 AppID',
    qcloudSecretId: '你的腾讯云 SecretId',
    qcloudSecretKey: '你的腾讯云 SecretKey',
    wxMessageToken: 'weixinmsgtoken',
    networkTimeout: 30000,
}
module.exports = CONF