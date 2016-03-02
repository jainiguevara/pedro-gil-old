/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	marshallHomepage: function (req, res) {
	    if (!req.session.me) {
	        req.session.me = {};
	        return res.redirect('/login');
	    }
	    
	    User.findOne({
			username: req.session.me
		}).exec(function foundUser(err, user)
		{
			if (err) return res.negotiate(err);
			if (!user) {
			   sails.log.verbose('Session refer to user that no longer exists. The page will redirect to login page.');
			   req.session.me = {};
			   return res.redirect('/login');
			}
			res.view('dashboard', {
			   me: {
			       id : user.id,
			       firstName : user.firstName
			   } 
			});
		}
		);
	}
};

