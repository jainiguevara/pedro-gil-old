/**
 * PermissionController
 *
 * @description :: Server-side logic for managing permissions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    try {
      Command.create(req.body).exec(function expenseMade(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Command created: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    try {
      Command.update(req.headers['id'], req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated command: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  }	
};