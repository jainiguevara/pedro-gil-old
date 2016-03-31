/**
 * ApplicantController
 *
 * @description :: Server-side logic for managing applicants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    try {
      Applicant.create(req.body).exec(function applicantSaved(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Created applicant: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      Applicant.update(req.body.id, req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated applicant: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  deploy: function(req, res) {
    try {
      Applicant.update(req.body.id, 
      { 
        dateDeployed : req.body.dateDeployed, 
        state : 1, 
        updatedBy : req.body.updatedBy
      }).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated applicant: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  search: function(req, res) {
    try {
      
      if (req.param('id') !== '') {
        //SEARCH BY ID
        //Object: Applicant 
        Applicant.findOne({ id: req.param('id'), status : 1 }).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(req.url + " results: " + JSON.stringify(results));
            return res.json(results);
        });
      } else if (req.param('search') !== '') {
          //SEARCH BY EITHER OR firstName, lastName, referenceNo, passportNo
          //Object: Applicant Array
          Applicant.find(
          {
          or: [
            { 'firstName': { 'contains': req.param('search') } },
            { 'lastName': { 'contains': req.param('search') } },
            { 'referenceNo': { 'contains': req.param('search') } },
            { 'passportNo': { 'contains': req.param('search') } }
          ], status : 1 }
          ).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(results);
            return res.json(results);
          });
      } else {
          //ALL
          //Object: Applicant Array
          Applicant.find({status : 1}).exec(function (err, results) {
            if (err) { console.log(err); return res.json(err); }
            console.log(results);
            return res.json(results);
          });
      }
    } catch (e) { console.log(e); return res.json(e); }
  }
};

