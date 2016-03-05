var express = require('express');
var router = express.Router();
var api = require('./api/api_routes');
var ui = require('./ui/bus_hot_spots_routes');

router.use(['/', '/bus_hot_spots'], ui);
router.use('/bus_hot_spots/api', api);

module.exports = router;