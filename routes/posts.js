var express = require('express');
var router = express.Router();
var PostModel = require('../models/posts');
// 文章页路由
// 权限检测
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
	// res.send(req.flash());
	// res.render('posts');
	var author = req.query.author;

	PostModel.getPosts(author)
		.then(function(posts) {
			res.render('posts', {
				posts: posts
			});
		})
		.catch(next);

});

// POST /posts 发表文章
router.post('/', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;
	// post参数
	var post = {
		author: author,
		title: title,
		content: content,
		pv: 0
	};

	PostModel.create(post)
		.then((result) => {
			post = result.ops[0];
			req.flash('success', '发表成功');
			// 发表后跳至文章页
			res.redirect(`/posts/${post._id}`);
		})
		.catch(next);
})

// GET /posts/create 创建文章页
router.get('/create', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	res.render('create');
})

// GET /posts/:postId 单独一篇文章
router.get('/:postId', function (req, res, next) {
	res.send(req.flash());
})

// POST /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	res.send(req.flash());
})

// POST /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	res.send(req.flash());
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	res.send(req.flash());
})

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
	res.send(req.flash());
})

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId.remove', checkLogin, function (req, res, next) {
	res.send(req.flash());
})

module.exports = router;
