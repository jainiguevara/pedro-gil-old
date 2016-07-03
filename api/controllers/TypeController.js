/**
 * TypeController
 *
 * @description :: Server-side logic for managing types
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function (req, res) {
    try {
      Type.create(req.body).exec(function applicantSaved(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Created type: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      Type.update(req.body.id, req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated type: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  get: function(req, res) {
    try {
      //console.log(req.param('module'));
      Type.find({ module : req.param('module'), status : 1 }).exec(function recordFound(err, result){
        if (err) { console.log(err); return res.json(err); }
        //console.log('Found type/s: ' + JSON.stringify(result));
        return res.jsonp(result);
      });
    } catch (e) { console.log(e); return res.jsonp(e); }
  },
  
  search: function(req, res) {
    try {
      if (req.param('id') !== '') {
        Type.findOne({ id: req.param('id')}).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(req.url + " results: " + JSON.stringify(results));
            return res.jsonp(results);
        });
      }
    } catch (e) { console.log(e); return res.jsonp(e); }
  }
};

