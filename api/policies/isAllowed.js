module.exports = function isAllowed(req, res, next) {
    var url = req.url.split('?')[0];
    var log = { 'policy' : 'isAllowed', 'url' : url, 'username' : req.session.me.username, 'role' : req.session.me.role, 'status' : 'OK' };
    try {
       User.findOne({
    		username: req.session.me.username
    	}).exec(function foundUser(err, user)
    	{
    	    if (user. role === "su") {
    	        console.log(log);
    	        return next();
    	    }
    		Command.findOne({
    		        role : user.role,
    		        route : url
    		    }).exec(function foundCommand(err, cmd)
    		    {
    		        if (err) {
    		            log.status = err;
    		            console.log(log);
    		            return next(log);
    		        }
            		if (!cmd) {
            		    log.status = 'NOT-ALLOWED';
    		            console.log(log);
            		    return next(url + ' : ' + log.status);
            		} else {
            		    console.log(log);
    	                return next();
            		};
    		    });
            
    	});
    } catch (e) {
        log.status = e;
    	console.log(log);
    	return next(log);
    }
};