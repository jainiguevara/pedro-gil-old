/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    
	dashboard: function (req, res) {
		if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
		try {
			console.log(req.session.me.username + ' redirected to DashboardController');
			res.locals.layout = "layout";
		    //APPLICANT
		    //Initialize
		    var tieUps = '';
		    TieUp.find({status : 1}).exec(function (err, results) {
		    	 var ddlTieUp = results.map(function(a) {
		    		return { 
		    			id : a.id, 
		    			name : a.name
		    		};
		    	});
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
			    	Type.find({status : 1}).exec(function (err, results) {
			    		var ddlType = results.map(function(a) {
			    			return { description : a.description, module : a.module };
			    		});
			    		var dashboardVals = { 
			    			me : req.session.me, 
			    			applicants : applicants,
			    			ddlTieUp : ddlTieUp, 
			    			ddlType : ddlType,
		    			};
					    res.locals.layout = 'layout';
						res.locals.title = 'Dashboard';
						console.log(dashboardVals);
						return res.view('private/applicant', dashboardVals);
			    	});
		    	});
			});
		} catch (e) {
			req.session.me = undefined; 
			return res.redirect('/');
		}
	}
}