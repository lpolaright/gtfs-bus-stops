// TODO: Naming convention of the file here is a little bit funny... (Chang that!)

var express = require('express');
var router = express.Router();
var gtfs = require('gtfs');

router.get('/:lat/:lon/:radius', function(req, res, next) {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var radius = req.params.radius;
    gtfs.getRoutesByDistance(lat, lon, radius, function(err, routes) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(routes));
        } else {
            console.log(err);
            throw err;
        }

    });
});

module.exports = router;