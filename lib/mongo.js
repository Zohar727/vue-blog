// 数据库配置

var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var moment = require('moment');
// 这个是干嘛用的?
var objectIdToTimestamp = require('objectid-to-timestamp')
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据id生成创建时间 created_at 不是太懂....
mongolass.plugin('addCreatedAt', {
	afterFind: function (results) {
		results.forEach(function (item) {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		});
		return results;
	},
	afterFindOne: function (result) {
		if (result) {
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
		}
		return result;
	}
});

// 用户表
exports.User = mongolass.model('User', {
	name: { type: 'string' },
	password: { type: 'string' },
	gender: { type: 'string', enum: ['m', 'f', 'x'] },
	bio: { type: 'string' }
});

// 文章表
exports.Post = mongolass.model('Post', {
	// Mongolass.Types.ObjectId 不太懂..
	author: {type: Mongolass.Types.ObjectId}
})
exports.User.index({ name: 1}, { unique: true }).exec(); //用户名为唯一索引