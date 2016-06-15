/**
 * CountryController
 *
 * @description :: Server-side logic for managing Countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    try {
      Country.create(req.body).exec(function applicantSaved(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Created country: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      Country.update(req.headers['id'], req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated country: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  get: function(req, res) {
    try {
      Country.find({ module : req.param('module'), status : 1 }).exec(function recordFound(err, result){
        if (err) { console.log(err); return res.json(err); }
        return res.json(result);
      });
    } catch (e) { console.log(e); return res.json(e); }
  }
};

