/**
 * CollectibleController
 *
 * @description :: Server-side logic for managing Collectible
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res) {
    try {
      Collectible.create(req.body).exec(function paymentMade(err, created)
      {
        if (err) { console.log(err); return res.json(err); }
        console.log('Collectible made: ' + JSON.stringify(created));
        return res.json(created);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
  
  update: function(req, res) {
    console.log(req.url);
    try {
      Collectible.update(req.body.id, req.body).exec(function afterwards(err, updated){
        if (err) { console.log(err); return res.json(err); }
        console.log('Updated collectible: ' + JSON.stringify(updated));
        return res.json(updated);
      });
    } catch (e) { console.log(e); return res.json(e); }
  },
};

