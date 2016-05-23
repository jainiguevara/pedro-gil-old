/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	admin: function(req, res) {
		try {
			if (!req.session.me) return res.redirect('/');
		    console.log(req.session.me.username + ' redirected to AdminController');
		    User.find().exec(function (err, results) {
		    	var users = results.map(function(a) {
		    	return { 
		    		id : a.id, 
		    		username : a.username,
		    		firstName : a.firstName,
		    		lastName : a.lastName,
		    		dateOfBirth : a.dateOfBirth,
		    		email : a.email,
		    		role : a.role,
		    		status : a.status === 1 ? 'Active' : 'Deactivated'}
		    	});
		    	//ADD DROP DOWN LIST FOR USER ROLES
		    	
		    	//ADD DROP DOWN LIST FOR USER ROLES
			    var dashboardVals = { 
			    		me : req.session.me, 
			    		users : users
		    	};
				res.locals.layout = 'layout';
				res.locals.title = 'Admin';
				console.log(dashboardVals);
				return res.view('private/admin', dashboardVals);
			});	
		} catch (e) { console.log(e); return; }
	}
}

