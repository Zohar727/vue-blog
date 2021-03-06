var express = require('express');
var router = express.Router();
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
// 文章页路由
// 权限检测
var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', function (req, res, next) {
	// res.send(req.flash());
	// res.render('posts');
	var author = req.query.author;

	PostModel.getPosts(author)
		.then(function(posts) {
			// res.render('posts', {
			// 	posts: posts
			// });
			return res.json({status: false, data: posts});
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
	// res.send(req.flash());
	var postId = req.params.postId;

	Promise.all([
		PostModel.getPostById(postId), // 获取文章信息
		CommentModel.getComments(postId), // 获取该文章所有留言
		PostModel.incPv(postId) // pv 加 1
	])
	.then((result) => {
		var post = result[0];
		var comments = result[1];
		if (!post) {
			throw new Error('该文章不存在');
		}

		// res.render('post', {
		// 	post: post,
		// 	comments: comments
		// });
		return res.json({
			status: true,
			data: {
				post: post,
				comments: comments
			}
		})
	})
	.catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	var postId = req.params.postId;
	var author = req.session.user._id;

	PostModel.getRawPostById(postId)
		.then((post) => {
			if (!post) {
				throw new Error('该文章不存在');
				return res.json({
					status: false,
					msg: '文章不存在'
				})
			}
			if (author.toString() !== post.author._id.toString()) {
				throw new Error('权限不足');
				return res.json({
					status: false,
					msg: '权限不足'
				})
			}
			// res.render('edit', {
			// 	post: post
			// });
			return res.json({
				status: true,
				data: {
					post: post,
				}
			})

		})
		.catch(next);
});

// POST /posts/:postId/edit 更新文章页
router.post('/:postId/edit', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	var postId = req.params.postId;
	var author = req.session.user._id;
	var title = req.fields.title;
	var content = req.fields.content;

	PostModel.updatePostById(postId, author, {title: title, content: content})
		.then(() => {
			req.flash('success', '编辑文章成功');
			// 编辑成功后跳转
			// res.redirect(`/posts/${postId}`);
			return res.json({
				status: true,
				msg: '编辑文章成功'
			})
		})
		.catch(next);
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	var postId = req.params.postId;
	var author = req.session.user._id;

	PostModel.delPostById(postId, author)
		.then(() => {
			req.flash('success', '删除文章成功');
			// 删除成功后跳转
			// res.redirect('/posts');
			res.json({
				status: true,
				msg: '删除文章成功'
			})
		})
		.catch(next);
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	var author = req.session.user._id;
	var postId = req.params.postId;
	var content = req.fields.content;
	var comment = {
		author: author,
		postId: postId,
		content: content
	};

	CommentModel.create(comment)
		.then(() => {
			req.flash('success', '留言成功');
			// 留言成功后跳转
			res.redirect('back');
		})
		.catch(next);
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId.remove', checkLogin, function (req, res, next) {
	// res.send(req.flash());
	var commentId = req.params.commentId;
	var author = req.session.user._id;

	CommentModel.delCommentById(commentId, author)
		.then(() => {
			req.flash('success', '删除留言成功');
			res.redirect('back');
		})
		.catch(next);
});

module.exports = router;
