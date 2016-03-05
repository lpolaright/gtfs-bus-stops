var express = require('express');
var router = express.Router();
var routes = require('./routes_routes');
var stops = require('./stops_routes');

// hello world
router.use('/routes', routes);
router.use('/stops', stops);

module.exports = router;