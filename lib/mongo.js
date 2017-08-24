// 数据库配置

var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 用户表
exports.User = mongolass.model('User', {
	name: { type: 'string' },
	password: { type: 'string' },
	avatar: { type: 'string' },
	gender: { type: 'string', enum: ['m', 'f', 'x'] },
	bio: { type: 'string' }
});
exports.User.index({ name: 1}, { unique: true }).exec(); //用户名为唯一索引