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
      Type.update(req.headers['id'], req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated type: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  get: function(req, res) {
    try {
      console.log(req.param('module'));
      Type.find({ module : req.param('module'), status : 1 }).exec(function recordFound(err, result){
        if (err) { console.log(err); return res.json(err); }
        console.log('Found type/s: ' + JSON.stringify(result));
        return res.json(result);
      });
    } catch (e) { console.log(e); return res.json(e); }
  }
};

