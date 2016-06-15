/**
 * CenterController
 *
 * @description :: Server-side logic for managing centers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
create: function (req, res) {
    try {
      Center.create(req.body).exec(function centerMade(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Center made: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      Center.update(req.body.id, req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Center expense: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  get: function(req, res) {
    try {
      //console.log(req.param('module'));
      Center.find({ module : req.param('type'), status : 1 }).exec(function recordFound(err, result){
        if (err) { console.log(err); return res.json(err); }
        //console.log('Found type/s: ' + JSON.stringify(result));
        return res.jsonp(result);
      });
    } catch (e) { console.log(e); return res.jsonp(e); }
  }	
};

