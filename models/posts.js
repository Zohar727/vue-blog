// 发表文章model
var Post = require('../lib/mongo').Post;
// 引入markdown插件
var marked = require('marked');
var CommentModel = require('./comments');

// 将markdown转换成html
// 不是很懂这里....
Post.plugin('contentToHtml', {
	afterFind: function (posts) {
		return posts.map(function (post) {
			post.content = marked(post.content);
			return post;
		});
	},
	afterFindOne: function (post) {
		if (post) {
			post.content = marked(post.content);
		}
		return post;
	}
});

// 增加文章留言数显示
Post.plugin('addCommentsCount', {
	afterFind: function (posts) {
		return Promise.all(posts.map((post) => {
			return CommentModel.getCommentsCount(post._id).then((commentsCount) => {
				post.commentsCount = commentsCount;
				return post;
			});
		}));
	},
	afterFindOne: function (post) {
		if (post) {
			return CommentModel.getCommentsCount(post._id).then((count) => {
				post.commentsCount = count;
				return post;
			});
		}
		return post;
	}
});

module.exports = {
	// 新建文章
	create: function create(post) {
		return Post.create(post).exec()
	},

	// 根据ID获取文章
	// 不是很懂...
	getPostById: function getPostById(postId) {
		return Post
			.findOne({_id: postId})
			.populate({path: 'author', model: 'User'})
			.addCreatedAt()
			.addCommentsCount()
			.contentToHtml()
			.exec();
	},

	// 根据创建时间降序获取素有用户文章或者某个特定用户的所有文章
	getPosts: function getPosts(author) {
		var query = {};
		if (author) {
			query.author = author;
		}
		return Post
			.find(query)
			.populate({path: 'author', model: 'User'})
			.sort({_id: -1})
			.addCreatedAt()
			.addCommentsCount()
			.contentToHtml()
			.exec();
	},

	// 根据文章ID给PV加1
	incPv: function incPv(postId) {
		return Post
			.update({_id: postId}, { $inc: {pv: 1}})
			.exec();
	},

	// 通过文章id获取一篇文章（编辑）
	getRawPostById: function getRawPostById(postId) {
		return Post
			.findOne({_id: postId})
			.populate({ path: 'author', model: 'User'})
			.exec();
	},

	// 通过用户id和文章id更新一篇文章
	updatePostById: function updatePostById(postId, author, data) {
		return Post.update({ author: author, _id: postId}, { $set: data}).exec();
	},

	// 通过用户id和文章id删除一篇文章
	delPostById: function delPostById(postId, author) {
		return Post.remove({ author: author, _id: postId})
			.exec()
			.then((res) => {
				// 文章删除后再删除所有留言
				if (res.result.ok && res.result.n > 0) {
					return CommentModel.delCommentByPostId(postId);
				}
			});
	}













}