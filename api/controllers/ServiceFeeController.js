/**
 * ServiceFeeController
 *
 * @description :: Server-side logic for managing servicefees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
    try {
      ServiceFee.create(req.body).exec(function serviceFeeMade(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Service fee made: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      ServiceFee.update(req.body.id, req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated service fee: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  }		
};

