var express = require('express');
var router = express.Router();
var gtfs = require('gtfs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('bushotspots', {title: 'Bus hot spots'});
});

router.get('/bus_hot_spots', function(req, res, next) {
    res.render('bushotspots', {title: 'Bus hot spots'});
});

router.get('/bus_hot_spots/stops/:route_id', function(req, res, next) {
    var route_id = req.params.route_id;
    // radius of 0.48 is around 15 mins walk
    gtfs.getStopsByRoute('localAgency', route_id, function(err, stops) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(stops[0].stops));
        } else {
            console.log(err);
            throw err;
        }
    });
});

router.get('/bus_hot_spots/routes/:lat/:lon/:radius', function(req, res, next) {
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