// 用户权限中间件
module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		// 检测用户是否登录
		if (!req.session.user) {
			req.flash('error', '未登录');
			// return res.redirect('/signin')
			// return res.json({status: false, msg: '未登录'});
			return res.sendStatus(401);
		}
		next();
		
	},

	checkNotLogin: function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录');
			return res.redirect('back');
		}
		next();
	}
}