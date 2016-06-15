/**
 * AdminController
 *
 * @description :: Server-side logic for managing Admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	admin: function(req, res) {
		try {
			res.locals.layout = "layout-admin";
		  	res.locals.title = "Admin Portal";
			if (!req.session.me) return res.redirect('/');
		    console.log(req.session.me.username + ' redirected to AdminController');
		    User.find().exec(function (err, results) {
		    	var users = results.map(function(a) {
		    	return { 
		    		id : a.id, 
		    		username : a.username,
		    		firstName : a.firstName,
		    		lastName : a.lastName,
		    		dateOfBirth : setToMMDDYYYY(a.dateOfBirth),
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
				//console.log(dashboardVals);
				return res.view('private/admin', dashboardVals);
			});	
		} catch (e) { console.log(e); return; }
	}
}

function setToMMDDYYYY(date) 
{
    if (typeof date === 'undefined')
    return "";
    else {
        var date = new Date(date),
            yr = date.getFullYear(),
            month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            day = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate();
        return month + '-' + day + '-' + yr;
    }
}
