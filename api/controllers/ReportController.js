/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	collection: function(req, res) {
	    if (typeof req.session.me === 'undefined') { req.session.me = undefined; return res.redirect('/'); };
	    res.locals.layout = "layout-report";
		res.locals.title = "Reports";
	      console.log(req.url);
	      var endDate = new Date(req.param('end'));
        endDate.setDate(endDate.getDate() + 1);
        var dailyParam = new Date(req.param('start'));
        dailyParam.setDate(dailyParam.getDate() + 1)
        //var dateParam = req.param('start') !== req.param('end') ? { '>=': req.param('start'), '<': endDate } : { '>': req.param('start') } ;
        var dateParam = { '>=': req.param('start'), '<': endDate };
        console.log(dateParam);
        try {
          Payment.find(
            {
              status : 1,
              createdAt: dateParam
            }
          )
          .populate('owner')
          .sort('createdAt')
          .sort('owner')
          .exec(function afterwards(err, results){
            if (err) { console.log(err); return res.json(err); }
    		    var report = results.map(function(a) {
    		    			return { 
    		    			    date : a.createdAt, 
    		    			    name : a.owner.firstName + ' ' + a.owner.lastName, 
    		    			    type : a.type, 
    		    			    amount : a.amount
    		    			};
    		    		});
    		    console.log('Payment/s found: ' + JSON.stringify(report));
    		    var collectionResults = {
    		      headers : {
    		        start : req.param('start'),
    		        end : req.param('end'),
    		        me : req.session.me 
    		      }, 
    		      report : report  
    		    };
            return res.view('private/collection', collectionResults);
          });
        } catch (e) { console.log(e); return res.json(e); }
	}
};

