//微信请求access_token
const config = require('../config/config');
const request = require('../config/request');
const Tools = require("../tools/tools");

var wx = {
	APPID: config.appId,
	APPSECRET: config.appSecret,
	token: config.token,
	init: function () {
		var token = this.getToken();
		if (token) {
			config.token = this.getToken();
		}
	},
	getToken: function () {
		var data = request.get('https://api.weixin.qq.com/cgi-bin/token', {
			qs: {
				grant_type: 'client_credential',
				appid: this.APPID,
				secret: this.APPSECRET
			}
		})
		if (data) {
			return data.access_token;
		} else {
			return false;
		}
	},
	getOpenId: function (code) {
		var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
		url = url.replace("APPID", this.APP_ID);
		url = url.replace("SECRET", this.APP_SECRET);
		url = url.replace("CODE", code);
		request.get(url, undefined, function (response, body) {
			if (response.statusCode == 200) {
				console.log("openid", body);
				return body;
			} else {
				return undefined;
			}
		});
	},
	getUserInfo: function (openid) {
		var access_token = Tools.Trim(this.token, ':g');
		var url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
		url = url.replace("ACCESS_TOKEN", access_token);
		url = url.replace("OPENID", openid);
		request.get(url, undefined, function (response, body) {
			if (response.statusCode == 200) {
				console.log("userinfo", body);
				return body;
			} else {
				return undefined;
			}
		})
	},
	refreshToken: function (refresh_token) {
		var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN";
		url = url.replace("APPID", this.APP_ID);
		url = url.replace("REFRESH_TOKEN", refresh_token);
		request.get(url, undefined, function (response, body) {
			if (response.statusCode == 200) {
				console.log("refresh_token", body);
				return body;
			}
		});
	},
	//暂留问题 formData表单提交问题
	postMsg: function (formData) {
		var url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN";
		url = url.replace("ACCESS_TOKEN", Tools.Trim(this.access_token, ':g'));
		request.post(url,{body: JSON.stringify(formData)},
			function (response, body) {
				if (response.statusCode == 200) {
					console.log("postMsg", body);
					return body;
				}
			});
	}
}
module.exports = wx;