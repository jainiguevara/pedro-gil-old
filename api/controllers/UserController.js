/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var json404 = '';
var json400 = '';
module.exports = {
	/* Login as user */
	
	login: function (req, res){
		res.locals.layout = "layout-public";
		res.locals.title = "Login";
		var Passwords = require('machinepack-passwords');
		json404 = {  message: { status : 404, value : 'Login failed for ' + req.param('username') + '. Incorrect username or password.' } };
		User.findOne({
			username: req.param('username')
		}).exec(function foundUser(err, user)
		{
			json400 = {  message: { status : 400, value : 'Login failed for '+ req.param('username') + '. ' + err } }
			if (err) 
			{
				console.log(json400.message.value);
				return res.view('login', json400);
			}
			if (!user)
			{
				console.log(json404.message.value);
				return res.view('login', json404);
			}
			Passwords.checkPassword({
			passwordAttempt: req.param('password'),
			encryptedPassword: user.password,
			}).exec({
			// An unexpected error occurred.
			error: function (err){
				json400 = {  message: { status : 400, value : 'Login failed for '+ req.param('username') + '. ' + err } }
				console.log(json400.message.value);
				return res.view('login', json400);
			},
			// Password attempt does not match already-encrypted version
			incorrect: function (){
				console.log(json404.message.value);
				return res.view('login', json404);
			},
			// OK.
			success: function (){
				console.log('Login success for ' + user.username);
				var me = { id : user.id, 
							username : user.username, 
							firstName : user.firstName, 
							message: { status : 200, value : '' } };
				req.session.me = me;
				return res.redirect('dashboard');
			},
			});
		}
		); 
	},
	
	create: function (req, res) {
	    try {
	      User.create(req.body).exec(function expenseMade(err, created)
	      {
	        if (err) { console.log(err); return res.json(err); }
	        console.log('User created: ' + JSON.stringify(created));
	        return res.json(created);
	      });
	    } catch (e) { console.log(e); return res.json(e); }
	},
  
	reset: function (req, res) {
		User.findOne({
			username: req.param('username'),
			dateofBirth: req.param('dateofBirth'),
			email: req.param('email')
		}).exec(function foundUser(err, user)
		{
			try {
				var json400 = {  message: { status : 400, value : 'Login failed for '+ req.param('username') + '. ' + err } }
				if (err) 
				{
					console.log(json400.message.value);
					return res.view('login', json400);
				}
				if (!user)
				{
					json404 = {  message: { status : 404, value : 'Username, email and date of birth does not match.', body : req.body } };
					console.log(json404.message.value);
					return res.json(json404);
				}
			    User.update(user.id, { password : 'P@ssw0rd1234' }).exec(function afterwards(err, updated){
			        if (err) { console.log(err); return res.json(err); }
			        console.log('Password reset: ' + JSON.stringify(updated));
			        return res.json(updated);
			      });
		    } catch (e) { console.log(e); return res.json(e); }
		});
	}
};

