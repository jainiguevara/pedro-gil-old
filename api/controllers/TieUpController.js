/**
 * TieUpController
 *
 * @description :: Server-side logic for managing tieups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    try {
      TieUp.create(req.body).exec(function tieupCreated(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Tie-up created: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      TieUp.update(req.body.id, req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated tie-up: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  get: function(req, res) {
    try {
      TieUp.find({ status : 1 }).sort('name ASC').exec(function recordFound(err, result){
        if (err) { console.log(err); return res.json(err); }
        console.log('Found tie-up/s: ' + JSON.stringify(result));
        return res.jsonp(result);
      });
    } catch (e) { console.log(e); return res.jsonp(e); }
  },
  
  search: function(req, res) {
    try {
      if (req.param('id') !== '') {
        TieUp.findOne({ id: req.param('id')}).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(req.url + " results: " + JSON.stringify(results));
            return res.jsonp(results);
        });
      }
    } catch (e) { console.log(e); return res.jsonp(e); }
  }
};

