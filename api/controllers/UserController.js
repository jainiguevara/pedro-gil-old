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
			username: req.param('username'), status : 1
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
							role : user.role,
							message: { status : 200, value : '' } };
				req.session.me = me;
				return res.redirect('dashboard');
			},
			});
		}
		); 
	},
	
	logout: function (req, res){
		console.log(req.session.me.username + " logs out.")
		req.session.me = undefined;
		console.log("Session value: " + req.session.me)
		return res.redirect('login');
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
	
	update: function(req, res) {
	    try {
	    	console.log(req.body);
	      User.update(req.body.id, req.body).exec(function afterwards(err, updated){
	        if (err) { console.log(err); return res.json(err); }
	        console.log('User updated: ' + JSON.stringify(updated));
	        return res.json(updated);
	      });
	    } catch (e) { console.log(e); return res.json(e); }
  	},	
  
	changePassword: function (req, res) {
			try {
			    User.update(req.body.id, { password : req.body.password }).exec(function afterwards(err, updated){
			        if (err) { console.log(err); return res.json(err); }
			        console.log('Password reset: ' + JSON.stringify(updated));
			        return res.json(updated);
			      });
		    } catch (err) { 
		    	var json500 = {  message: { status : 500, value : 'Change password failed for '+ req.param('username') + '. ' + err } }
		    	console.log(err); 
		    	return res.json(json500); 
		    }
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
	},
	
	search: function(req, res) {
    try {
      
      if (req.param('id') !== '') {
        //SEARCH BY ID
        //Object: Applicant 
        User.findOne({ id: req.param('id'), }).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(req.url + " results: " + JSON.stringify(results));
            return res.jsonp(results);
        });
      } else if (req.param('search') !== '') {
          //SEARCH BY EITHER OR firstName, lastName, username, email, role
          //Object: User Array
          User.find(
          {
          or: [
            { 'firstName': { 'contains': req.param('search') } },
            { 'lastName': { 'contains': req.param('search') } },
            { 'username': { 'contains': req.param('search') } },
            { 'email': { 'contains': req.param('search') } },
            { 'role': { 'contains': req.param('search') } }
          ]}
          ).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(results);
            return res.jsonp(results);
          });
      } else {
          //ALL
          //Object: User Array
          User.find().exec(function (err, results) {
            if (err) { console.log(err); return res.jsonp(err); }
            console.log(results);
            return res.jsonp(results);
          });
      }
    } catch (e) { console.log(e); return res.jsonp(e); }
  }
};

