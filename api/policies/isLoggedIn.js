module.exports = function(req, res, next) {
     if (!req.session.me) {
	        req.session.me = {};
	        return res.redirect('/login');
	 }
};