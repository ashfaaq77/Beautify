
function corsAllow(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5000'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization')

    next();
}

module.exports = { corsAllow };
