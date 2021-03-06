var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {
	afterFind: function (comments) {
		return comments.map((comment) => {
			comment.content = marked(comment.content);
			return comment;
		});
	}
});

module.exports = {
	// 创建一个留言
	create: function create(comment) {
		return Comment.create(comment).exec();
	},

	// 通过用户 id 和留言 id 删除一个留言
	delCommentById: function delCommentById(commentId, author) {
		return Comment.remove({ author: author, _id: commentId}).exec();
	},

	// 通过文章 id 删除该文章下所有留言
	delCommentByPostId: function delCommentByPostId(postId) {
		return Comment.remove({postId: postId}).exec();
	},

	// 通过文章 id 获取所有留言
	getComments: function getComments(postId) {
		return Comment
			.find({ postId: postId})
			.populate({path: 'author', model: 'User'})
			.sort({_id: 1})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},

	// 通过文章 id 获取留言数
	getCommentsCount: function getCommentsCount(postId) {
		return Comment.count({postId: postId}).exec();
	}
};