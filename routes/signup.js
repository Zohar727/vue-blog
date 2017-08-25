// 用户注册类路由

var express = require('express')
var router = express.Router()
var path = require('path')
var sha1 = require('sha1')

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 请求注册页
router.get('/', checkNotLogin, function(req, res, next) {
	// res.send(req.flash());
	res.render('signup');
});

// POST /signup 用户注册接口
router.post('/', checkNotLogin, function(req, res, next) {
	// res.send(req.flash());
	var name = req.fields.name;
	var password = req.fields.password;
	var gender = req.fields.gender;
	var bio = req.fields.bio;

	// 密码加密
	password = sha1(password);

	// 写入数据库的信息
	var user = {
		name: name,
		password: password,
		gender: gender,
		bio: bio
	};

	// 写入数据库
	UserModel.create(user)
		.then(function (result) {
			user = result.ops[0];
			// session 存入用户信息
			delete user.password;
			req.session.user = user;
			req.flash('success', '注册成功');
			// 跳转首页
			res.redirect('/posts');
		})
		.catch(function (e) {
			if (e.message.match('E1100 duplicte key')) {
				req.flash('error', '用户名已被占用');
				return res.redirect('/signup');
			}
			next(e);
		});

});

module.exports = router;