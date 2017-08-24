module.exports = function (app) {
	// 首页重定向
	app.get('/', function(req, res) {
		res.redirect('/posts')
	})

	// 用户类路由
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	// 首页路由
	app.use('/posts', require('./posts'));
}