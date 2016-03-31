/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	marshallHomepage: function (req, res) {
		
	    if (!req.session.me) {
	    	console.log("Session empty. Redirecting to login page.");
	        req.session.me = {};
	        return res.redirect('/login');
	    }
	    User.findOne({
			username: req.session.me.username
		}).exec(function foundUser(err, user)
		{
			if (err) { console.log('Bad request ' + err); return res.badRequest(); };
			if (!user) {
				console.log('Session refer to user that no longer exists. The page will redirect to login page.');
			   sails.log.verbose('Session refer to user that no longer exists. The page will redirect to login page.');
			   req.session.me = {};
			   return res.redirect('/login');
			}
			var me = { id : user.id, 
							username : user.username, 
							firstName : user.firstName, 
							message: { status : 200, value : '' } };
			req.session.me = me;
			return res.redirect('dashboard');
		}
		);
	}
};

