// 用户登录类路由

var express = require('express');
var sha1 = require('sha1');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
var createToken = require('../middlewares/check').createToken;

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
	// res.send(req.flash());
	res.render('signin');
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
	// res.send(req.flash());
	var name = req.fields.name;
	var password = req.fields.password;

	// 查数据库
	UserModel.getUserByName(name)
		.then((user) => {
			if (!user) {
				req.flash('error', '用户不存在');
				return res.redirect('back');
			}
			// 检查密码匹配
			if (sha1(password) !== user.password) {
				req.flash('error', '用户名或密码错误');
				return res.redirect('back');
			}
			req.flash('success', '登录成功');
			// 用户信息写入session
			delete user.password;
      req.session.user = user;
      res.json({
        code: 200,
        token: createToken(name)
      })
			// 跳至主页
			// res.redirect('/posts');
		})
		.catch(next);
});

module.exports = router;