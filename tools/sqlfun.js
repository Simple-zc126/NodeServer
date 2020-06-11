// sql语句
var sqlMap = {
	app:{
		userlogin:'insert into app (logintype,apptype,userData,date) value (?,?,?,?);'
	},
	wxapp:{
		question:{
			saveUser:'insert into user(uopenid, openid, sessionkey, ukey)values (?,?,?,?);',
			mainList: 'SELECT * FROM mainList WHERE uopenid = ?;',
			hotlist: 'SELECT * FROM mainList WHERE uopenid <> ? order by rand() limit 1 ;',
			delOrder:'DELETE FROM mainList WHERE uopenid = ? and idx = ?;',
			makeOrderUsermsg:'insert into mainList(uopenid, idx, username,useremail,skuName,overDate) values (?,?,?,?,?,?);',
			makeOrderOptions:'insert into OrderOptions(uopenid, idx, options) values ( ?, ?, ? );',
			makeOrderSavepics:'insert into OrderFils(uopenid, idx) values (?,?);',
			makeOrderSavepicsupload: ' update OrderFils set pics = concat( pics ,? ) where uopenid = ? and idx = ?;',
			getContent:'SELECT * FROM mainList WHERE idx = ?;',
			getPics:'SELECT * FROM OrderFils WHERE idx = ?;',
			getOptions:'SELECT options FROM OrderOptions WHERE uopenid = ? and idx = ?;',
			updeteOptions:'update OrderOptions set options = ? where uopenid = ? and idx = ?;'
		}
	},
    // 用户
    user: {
    	login: 'SELECT model FROM admin WHERE username = ? and userpsw = ?;',
    	model_all: 'SELECT * FROM model;',
    	model: 'SELECT * FROM model WHERE modid =?;',
    	place: 'SELECT * FROM product WHERE modid =?;',
        add: 'insert into admin(username, userpsw, name) values ( ?, ?, ?);',
    	sum_sall: 'SELECT sum(ordersall) sum From userorder WHERE modid = ? and isok="yes";',
    	sava_sum:'update model set money=?,traffic=?,unfinishOrder=?,TodayOrder=? where modid = ?;',
    	sum_order: 'select COUNT(*) cont from userorder where modid = ?;',
    	sum_unorder:'select COUNT(*) cont from userorder where modid = ? and isok="no";',
    	sum_waitorder:'select COUNT(*) cont from userorder where modid = ? and isok="wait";'
    },
    admin:{
    	v:'SELECT * FROM admin_v WHERE modid =? and V=? and placeid=?;',
    	nv:'SELECT * FROM admin_v WHERE modid =? and SVid=? and placeid=?;',
    	vup: 'update admin_v set V=? where Vid=?;',
    	DelVid:'DELETE FROM admin_v WHERE Vid=?;',
    	makeNote:'update admin_v set note=? where Vid=?;',
    	shoplist:'insert into shoplist set itname=?,itsize1=?,itsize2=?,itsize3=?,itsall=?,type=?,itv1=?,time=?,msg=?,modid=?;',
    	shopid:'select max(itid) itid from shoplist;',
    	shopimglist: 'update shoplist set img=?,imglist=? where itid=?;',
		loginAllOrder: 'select * from userorder;',
		loginOrOrder: 'select * from userorder where isok=?;',
		ad_finishOrder: 'update userorder set kdd=?,isok=? where orderid=?;',
    	PVuser: 'update admin_v set PV=PV+1 where Vid=?;'
    },
    //资讯类
    info: {
    	info_list: 'select * from info_list where modid = ?;',
    	subinfo:'insert into info_list set title=?,sendperson=?,begin=?,over=?,note=?,phone=?,startplace=?,kind=?,overplace=?,num=?,modid=?;',
    	seachlist:'select * from info_list where modid = ? and (startplace=? or overplace=? or begin=?);',
    	seachtitle:'select * from info_list where modid = ? and title like ? and kind=?;'
    },
    //达人页面
    dr: {
    	drcon: 'select drjs,drimg from three order by rand() limit 1;'
    },
    //list页面
    wplist: {
    	LoginItems: 'select * from shoplist where modid=?;',
    	LoginItem: 'select * from shoplist where itid=?;',
    	listcontent: 'SELECT * FROM listcontent WHERE id = ?;',
    	loginpl:'select * from shoppl;',
    	sendpl:'insert into shoppl set itid=?,name=?,img=?,content=?,time=?;'
    },
    wxuser:{
    	MakeSureUser:'select * from wxuser where openid=?;',
    	userinfo:'insert into wxuser set openid=?,nickname=?,sex=?,city=?,province=?,country=?,headimgurl=?,remark=?,groupid=?,tagid_list=?,subscribe_scene=?;',
    	getOrderList:'select * from userorder where openid=?;',
    	getOrderPlace:'select * from userplace where openid=?;',
    	setOrderList:'insert into userorder set openid = ?,shplace=?,orderid=?,ordermsg=?,ordersall=?,orderimg=?;',
    	insertplace:'insert into userplace set openid = ?,name=?,phone=?,place=?,msg=?;',
    	changePlace:'update userplace set name=?,phone=?,place=?,msg=? where openid = ?;',
    	overorder:'update userorder set isok=? where openid=? and orderid=?',
    	loseorder:'update userorder set isok=?,losewhy=? where openid=? and orderid=?',
    	del_Order: 'DELETE FROM userorder WHERE orderid=?; '
    },
    join:{
    	joinus:'select placeid from product WHERE modid =? and placename=?;',
    	selectplaceid:'select max(placeid) lastid from product;',
    	insertplace:'insert into product set modid =?, placename=?;',
    	findwxuser:'select nickname,headimgurl from wxuser where openid = ?;',
    	insertadminv:'insert into admin_v set modid =?,placeid=?,name=?,Vid=?,SVid=?,v_img=?,V=?;',
    	SVuser:'select * from admin_v where modid =? and Vid=?;',
    	changenextV: 'update admin_v set nextnum=nextnum+1 where Vid=?',
    	wxuser: 'select * from admin_v where Vid = ?;'
    }
}
    
module.exports = sqlMap;