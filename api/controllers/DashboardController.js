/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
	dashboard: function (req, res) {
		if (!req.session.me) return res.redirect('/');
	    console.log(req.session.me.username + ' redirected to DashboardController');
	    
	    //APPLICANT
	    //Initialize
	    var tieUps = '';
	    TieUp.find({status : 1}).exec(function (err, results) {
	    	var ddlTieUp = results.map(function(a) {return { id : a.id, name : a.name };});
	    	Applicant.find({status : 1}).exec(function (err, results) {
	    		var applicants = results.map(function(a) {
	    			return { 
	    				id : a.id,
	    				referenceNo : a.referenceNo,
	    				firstName : a.firstName, 
	    				lastName: a.lastName, 
	    				dateOfBirth : a.dateOfBirth,
	    				passportNo : a.passportNo };
	    		});
	    		var dashboardVals = { me : req.session.me, ddlTieUp : ddlTieUp, applicants : applicants };
		        res.locals.layout = 'layout';
			    res.locals.title = 'Dashboard';
			    console.log(dashboardVals);
			    return res.view('private/applicant', dashboardVals);
	    	});
		});
	}
}