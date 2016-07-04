module.exports = function(req, res, next) {
    var url = req.url.split('?')[0];
    var log = { 'policy' : 'isAuthenticated', 'url' : url, 'username' : 'UNKNOWN', 'status' : 'OK' };
    if (!req.session.me) {
        log.status = 'UNKNOWN-REQUEST';
        console.log(log);
        return next(url + ' : ' + log.status);
    }
    log.username = req.session.me.username;
    console.log(log);
    return next();
};