/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	/* Login as user */
	login: function (req, res){
		var Passwords = require('machinepack-passwords');
		//var user = User;
		User.findOne({
			username: req.param('username')
		}).exec(function foundUser(err, user)
		{
			if (err) return res.negotiate(err);
			if (!user) return res.notFound();
			
			Passwords.checkPassword({
			passwordAttempt: req.param('password'),
			encryptedPassword: user.password,
			}).exec({
			// An unexpected error occurred.
			error: function (err){
				if (err) return res.badRequest(err);
			},
			// Password attempt does not match already-encrypted version
			incorrect: function (){
				return res.notFound();
			},
			// OK.
			success: function (){
				req.session.me = user.id;
				console.log(JSON.stringify(user));
				return res.ok();
			},
			});
		}
		);
	}
};

