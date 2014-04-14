
/*
 * GET home page.
 */
 
var mongoose = require('mongoose');
var models = require('./models');
var util = require('util');
var User = models.User;
var Post = models.Post;
var crypto = require('crypto');
var flash = require("connect-flash");
var settings = require('../setting');
mongoose.connect('mongodb://'+ settings.host + '/' + settings.db);

module.exports = function(app) {
	app.get('/', function(req,res){
			var query = Post.find(null).exec();
			query.addBack(function (err,docs) {
				return res.render('index', { title: "Lloyd's" ,blogs:docs});
			});
	});

	app.post('/post', checkLogin);
	app.post('/post', function(req,res){
		var currentUser = req.session.user;
		var post = new Post({userid:currentUser.userid,content:req.body.content,time:new Date()});
		post.save(function(err){
			if (err){
				util.log("Save error");
			}
			req.flash('success','发布成功！');
			return res.redirect('/u/'+currentUser.userid);
		});
	});
	
	app.get('/reg', checkNotLogin);
	app.get('/reg', function(req,res){
		res.render('reg', { title: "Lloyd's" });
	});
	
	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req,res){
		if(req.body['password-repeat']!=req.body['password']){
			util.log("here");
			req.flash('error','两次输入的口令不一致');
			return res.redirect('/reg');
		}
		var query_doc= {userid:req.body.username} ;
		var query = User.find(query_doc).exec();
		query.addBack(function (err,docs) {
			if (docs.length == 0){
				var md5= crypto.createHash('md5');
				var password = md5.update(req.body.password).digest('base64');
				var user= new User({userid:req.body.username,password:password}) ;
				user.save(function(err){
					if (err) {
						util.log("Save error");
					}
				});
				req.session.user = user;
				req.flash('success','注册成功');
				return res.redirect('/');
				//return res.render('regist/success', { title: "Lloyd's" , user:req.body.username});
			} else {
				req.flash('error','注册失败');
				return res.redirect('/reg');
				//return res.render('regist/fail',{ error:'账号已被注册！'});
			}
		});
	});

	app.get('/login', checkNotLogin);
	app.get('/login', function(req,res){
		res.render('login', { title: "Lloyd's" });
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function(req,res){
		var md5= crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');
		var query_user= {userid:req.body.username} ;
		var query_password= {userid:req.body.username,password:password} ;
		User.count(query_user , function(err,doc){
			if (doc == 0) {
				req.flash('error','该用户不存在，请先注册！');
				return res.redirect('/login');
			} else {
				var user = new User(query_password);
				User.count(query_password , function(err,result){
					if (result == 0) {
						req.flash('error','用户密码输入错误，请重新输入！');
						return res.redirect('/login');
					} else {
						req.flash('success','登陆成功！');
						req.session.user = user;
						return res.redirect('/u/'+req.session.user.userid);
					}
				});
			}
		});
	});

	app.get('/logout', checkLogin);
	app.get('/logout', function(req,res){
		req.session.user = null;
		req.flash('success','登出成功！');
		return res.redirect('/');
	});
	
	app.get('/u/:user', function(req,res){
		var currentUser = req.session.user;
		var query_doc = {userid:currentUser.userid};
		var sort_doc = {time:-1};
		var query = Post.find(query_doc).sort(sort_doc).exec();
		query.addBack(function (err,docs) {
			return res.render('user' , {blogs:docs});
		});
	});
	
	function checkLogin(req,res,next){
		if (!req.session.user) {
			req.flash('error','未登录');
			return res.redirect('login');
		}
		next();
	}
	
	function checkNotLogin(req,res,next){
	if (req.session.user) {
		req.flash('error','已登录');
		return res.redirect('/');
	}
	next();
	}
};
