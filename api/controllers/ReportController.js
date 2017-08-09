/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	expense: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		res.locals.title = "Expenses Report";
	      var endDate = new Date(req.param('end'));
        endDate.setDate(endDate.getDate() + 1);
        var dailyParam = new Date(req.param('start'));
        dailyParam.setDate(dailyParam.getDate() + 1)
        //var dateParam = req.param('start') !== req.param('end') ? { '>=': req.param('start'), '<': endDate } : { '>': req.param('start') } ;
        var dateParam = { '>=': req.param('start'), '<': endDate },
        params = {
            status : 1,
            transactionDate: dateParam
        };
        if (req.param('type') !== 'ALL')
          params = {
            status : 1,
            transactionDate: dateParam,
            type: req.param('type')
          };
        console.log('Report Parameters:');
        console.log(params);
        console.log('principal : ' + req.param('principal'));
        try {
          Expense.find(params)
          .populate('owner', { where: { status: 1 } })
          .sort('transactionDate')
          .sort('owner')
          .exec(function afterwards(err, results){
            //console.log(results);
            if (err) { console.log(err); return res.json(err); }
    		    var report = results.map(function(a) {
    		      if (typeof a.owner !== 'undefined') {
    		          if (req.param('principal') === "ALL" && req.param('country') === "ALL")
      		    			return { 
      		    			    date : setToMMDDYYYY(a.transactionDate), 
      		    			    referenceNo : a.owner.referenceNo,
      		    			    name : a.owner.firstName + ' ' + a.owner.lastName, 
      		    			    type : a.type, 
      		    			    actualCost : a.actualCost,
      		    			    amount : a.amount,
      		    			    country : a.owner.country,
      		    			    principal : a.owner.principal,
      		    			    employer : a.owner.employer
      		    			};
      		    		else { 
      		    		  var filtered = {};
      		    		  if (a.owner.principal === req.param('principal') | a.owner.country === req.param('country')) { 
        		    			  filtered = { date : setToMMDDYYYY(a.transactionDate), 
        		    			  referenceNo : a.owner.referenceNo,
        		    			  name : a.owner.firstName + ' ' + a.owner.lastName, 
        		    			  type : a.type, 
        		    			  actualCost : a.actualCost,
        		    			  amount : a.amount,
        		    			  country : a.owner.country,
        		    			  principal : a.owner.principal,
        		    			  employer : a.owner.employer };
      		    		  } 
      		    		  return filtered;
      		    		}
    		      }
    		    		});
    		    //console.log('Payment/s found: ' + JSON.stringify(report));
    		    var collectionResults = {
    		      headers : {
    		        start : req.param('start'),
    		        end : req.param('end'),
    		        me : req.session.me 
    		      }, 
    		      report : report  
    		    };
    		    //console.log(report);
            return res.view('private/expense', collectionResults);
          });
        } catch (e) { console.log(e); return res.json(e); }
	},
	collection: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		  res.locals.title = "Collections Report";
	    var endDate = new Date(req.param('end'));
      endDate.setDate(endDate.getDate() + 1);
      var dailyParam = new Date(req.param('start'));
      dailyParam.setDate(dailyParam.getDate() + 1)
      var dateParam = { '>=': req.param('start'), '<': endDate },
      params = {
          status : 1,
          transactionDate: dateParam
      };
      if (req.param('type') !== 'ALL')
        params = {
          status : 1,
          transactionDate: dateParam,
          type: req.param('type')
        };
      console.log('Report Parameters:');
      console.log(params);
      try {
        Payment.find(params)
        .populate('owner', { where: { status: 1 } })
        .sort('transactionDate')
        .sort('owner')
        .exec(function afterwards(err, results){
          //console.log(results);
          if (err) { console.log(err); return res.json(err); }
    	    var report = results.map(function(a) {
    	      if (typeof a.owner !== 'undefined') {
      	      if (req.param('principal') === "ALL" && req.param('country') === "ALL")
        	    		return { 
        	    		    date : setToMMDDYYYY(a.transactionDate), 
        	    		    referenceNo : a.owner.referenceNo,
        	    		    name : a.owner.firstName + ' ' + a.owner.lastName, 
        	    		    type : a.type, 
        	    		    amount : a.amount,
        	    		    country : a.owner.country,
          		    	  principal : a.owner.principal,
          		    		employer : a.owner.employer
        	    		};
        	    else
        	    {
        	      var filtered = {};
        		    		  if (a.owner.principal === req.param('principal') | a.owner.country === req.param('country')) { 
          		    			  filtered = { date : setToMMDDYYYY(a.transactionDate), 
          		    			  referenceNo : a.owner.referenceNo,
          		    			  name : a.owner.firstName + ' ' + a.owner.lastName, 
          		    			  type : a.type, 
          		    			  actualCost : a.actualCost,
          		    			  amount : a.amount,
          		    			  country : a.owner.country,
          		    			  principal : a.owner.principal,
          		    			  employer : a.owner.employer };
        		    		  } 
        		    return filtered;
        	    }
    	      }
    	    });
    	    //console.log('Payment/s found: ' + JSON.stringify(report));
    	    var paymentResults = {
    	      headers : {
    	        start : req.param('start'),
    	        end : req.param('end'),
    	        me : req.session.me 
    	      }, 
    	      report : report  
    	    };
    	    //console.log(report);
          return res.view('private/collection', paymentResults);
        });
      } catch (e) { console.log(e); return res.serverError(e); }
	},
	deployment: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		  res.locals.title = "Applicant Status Report";
	    var endDate = new Date(req.param('end'));
      endDate.setDate(endDate.getDate() + 1);
      var dailyParam = new Date(req.param('start'));
      dailyParam.setDate(dailyParam.getDate() + 1)
      //var dateParam = req.param('start') !== req.param('end') ? { '>=': req.param('start'), '<': endDate } : { '>': req.param('start') } ;
      var dateParam = { '>=': req.param('start'), '<': endDate },
      state = -1;
      switch (req.param('state')) {
        case 'NEW': state = 0; break;
        case 'DEPLOYED': state = 1; break;
        case 'CANCELLED': state = 2; break;
        case 'TERMINATED': state = 3; break;
        default:
        state = -1
      }
      var params = {
          status : 1,
          dateDeployed: dateParam
      };
      if (state !== -1)
        params.state = state;
      if (req.param('principal') !== 'ALL')
        params.principal = req.param('principal');
      if (req.param('country') !== 'ALL')
        params.country = req.param('country');  
      console.log('Report Parameters:');
      console.log(params);
      try {
        Applicant.find(params)
        .populate('expenses', { where: { status: 1 } })
        .populate('payments', { where: { status: 1 } })
        .sort('dateDeployed')
        .exec(function afterwards(err, results) {
          if (err) { console.log(err); return res.json(err); }
    	    var report = results.map(function(a) { 
      	    		return { 
      	    		    date : setToMMDDYYYY(a.dateDeployed), 
      	    		    referenceNo : a.referenceNo,
      	    		    name : a.firstName + ' ' + a.lastName, 
      	    		    dateOfBirth : setToMMDDYYYY(a.dateOfBirth), 
      	    		    passportNo : a.passportNo,
      	    		    state : a.state,
      	    		    source : a.source,
      	    		    oec : a.oec,
      	    		    cg : a.cg,
      	    		    pdos : a.pdos,
      	    		    principal : a.principal,
      	    		    employer : a.employer,
      	    		    country: a.country,
      	    		    payments : a.payments,
      	    		    expenses : a.expenses
      	    		};
    	    });
    	    var deploymentResults = {
    	      headers : {
    	        start : req.param('start'),
    	        end : req.param('end'),
    	        me : req.session.me 
    	      }, 
    	      report : report
    	    };
          return res.view('private/deployment', deploymentResults);
        });
      } catch (e) { console.log(e); return res.json(e); }
	},
	ledger: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		  res.locals.title = "Individual Ledger";
      var params = {
          status : 1,
          id: req.param('id')
      };
      console.log('Report Parameters:');
      console.log(params);
      try {
      Applicant.findOne({ id: req.param('id'), status : 1 })
                .populate('expenses', { where: { status: 1 } } )
                .populate('payments', { where: { status: 1 } })
                .populate('collectibles', { where: { status: 1 } })
        .exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
          if (err) { console.log(err); return res.json(err); }
    	    console.log(results);
          return res.view('private/ledger', { report: results });
        });
      } catch (e) { console.log(e); return res.json(e); }
	},
	ledgerHistory: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		  res.locals.title = "Ledger History";
      console.log('Report Parameters:');
      try {
      Applicant.find({ passportNo: req.param('passportNo'), status : 1 })
                .populate('expenses', { where: { status: 1 } } )
                .populate('payments', { where: { status: 1 } })
                .populate('collectibles', { where: { status: 1 } })
        .exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
          if (err) { console.log(err); return res.json(err); }
    	    console.log(results);
          return res.view('private/ledgerhistory', { report: results });
        });
      } catch (e) { console.log(e); return res.json(e); }
	},
	collectibles: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		  res.locals.title = "Collectibles Report";
	    var endDate = new Date(req.param('end'));
      endDate.setDate(endDate.getDate() + 1);
      var dailyParam = new Date(req.param('start'));
      dailyParam.setDate(dailyParam.getDate() + 1)
      var dateParam = { '>=': req.param('start'), '<': endDate },
      params = {
          status : 1,
          transactionDate: dateParam
      };
      if (req.param('type') !== 'ALL')
        params = {
          status : 1,
          transactionDate: dateParam,
          type: req.param('type')
        };
      console.log('Report Parameters:');
      console.log(params);
      try {
        Collectible.find(params)
        .populate('owner', { where: { status: 1 } })
        .sort('transactionDate')
        .sort('owner')
        .exec(function afterwards(err, results){
          //console.log(results);
          if (err) { console.log(err); return res.json(err); }
    	    var report = results.map(function(a) {
    	      if (typeof a.owner !== 'undefined') {
      	      if (req.param('principal') === "ALL" && req.param('country') === "ALL")
        	    		return { 
        	    		    date : setToMMDDYYYY(a.transactionDate), 
        	    		    referenceNo : a.owner.referenceNo,
        	    		    name : a.owner.firstName + ' ' + a.owner.lastName, 
        	    		    type : a.type, 
        	    		    amount : a.amount,
        	    		    country : a.owner.country,
          		    	  principal : a.owner.principal,
          		    		employer : a.owner.employer
        	    		};
        	    else
        	    {
        	      var filtered = {};
        		    		  if (a.owner.principal === req.param('principal') | a.owner.country === req.param('country')) { 
          		    			  filtered = { date : setToMMDDYYYY(a.transactionDate), 
          		    			  referenceNo : a.owner.referenceNo,
          		    			  name : a.owner.firstName + ' ' + a.owner.lastName, 
          		    			  type : a.type, 
          		    			  actualCost : a.actualCost,
          		    			  amount : a.amount,
          		    			  country : a.owner.country,
          		    			  principal : a.owner.principal,
          		    			  employer : a.owner.employer };
        		    		  } 
        		    return filtered;
        	    }
    	      }
    	    });
    	    //console.log('Payment/s found: ' + JSON.stringify(report));
    	    var collectiblesResults = {
    	      headers : {
    	        start : req.param('start'),
    	        end : req.param('end'),
    	        me : req.session.me 
    	      }, 
    	      report : report  
    	    };
    	    //console.log(report);
          return res.view('private/collectibles', collectiblesResults);
        });
      } catch (e) { console.log(e); return res.serverError(e); }
	},
};

function setToMMDDYYYY(date) 
{
    if (typeof date === 'undefined')
    return "";
    else {
        var date = new Date(date),
            yr = date.getFullYear(),
            month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            day = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate();
        return month + '-' + day + '-' + yr;
    }
}

function addCommas(nStr)
{
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}