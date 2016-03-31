module.exports = function isAllowed(req, res, next) {
    console.log(req.param('createdBy') + ' ' + req.url);
    try {
       User.findOne({
			username: req.param('createdBy')
		}).exec(function foundUser(err, user)
		{
		    if (user.role !== "su")
		    {
    		    Command.findOne({
    		        role : user.role,
    		        route : req.url
    		    }).exec(function foundCommand(err, cmd)
    		    {
    		        if (err) console.log(err); next(err);
            		if (!cmd) console.log(user.username + ' not allowed to execute this command ' + req.url);
    		    });
            }
            next();
		});
    } catch (e) {console.log(e);}
};