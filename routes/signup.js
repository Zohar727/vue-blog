// 用户注册类路由

var express = require('express')
var router = express.Router()

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 请求注册页
router.get('/', checkNotLogin, function(req, res, next) {
	// res.send(req.flash());
	res.render('signup');
});

// POST /signup 用户注册接口
router.post('/', checkNotLogin, function(req, res, next) {
	res.send(req.flash());
});

module.exports = router;