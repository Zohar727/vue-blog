// 用户注销路由

var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	req.session.user = null;
	req.flash('success', '登出成功');
	// res.redirect('/posts');
	return res.json({status: false, msg: '登出成功'});
});

module.exports = router;