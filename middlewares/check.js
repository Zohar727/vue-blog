var jwt = require('jsonwebtoken')
// 用户权限中间件
module.exports = {
	checkLogin: function checkLogin(req, res, next) {
		// 检测用户是否登录
		if (!req.session.user) {
			req.flash('error', '未登录');
			return res.redirect('/signin')
		}
		next();
		
	},

	checkNotLogin: function checkNotLogin(req, res, next) {
		if (req.session.user) {
			req.flash('error', '已登录');
			return res.redirect('back');
		}
		next();
  },
  
  createToken: function (id) {
    const token = jwt.sign({
                    data: id
                  }, 'zohar', {expiresIn: '7d'});
    return token;
  },

  checkToken: function (req, res, next) {
    if (req.headers['authorization']){
      var token = req.headers.authorization;
      try {
        var decoded = jwt.verify(token,'zohar');
        // var decoded = jwt.decode(token);
        // 额..这里怎么会是小于..
        if (decoded.exp < Date.now()/1000) {
          res.send({
            code: 401,
            message: '登录过期'
          })
        }
      }catch(e){
        res.send(e);
      } 
    }
    next();
  }
}