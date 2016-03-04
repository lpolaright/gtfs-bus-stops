var express = require('express');
var router = express.Router();
var gtfs = require('gtfs');
var hotspots = require('../helpers/hotspots');

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

router.get('/bus_hot_spots/route_stops/:lat/:lon/:radius', function(req, res, next) {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var radius = req.params.radius;

    hotspots.getRoutesAndTheirStopsByDisance(lat, lon, radius, function(err, routeformation) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(routeformation));
        } else {
            cb(err);
        }
    });
});

router.post('/bus_hot_spots/locations', function(req, res, next) {
    var locations = req.body.locations;
    var radius = req.body.radius;

    hotspots.getAllLocationsRoutes(locations, radius, function(err, locationInfo) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(locationInfo));
        } else {
            cb(err);
        }
    });
});

router.post('/bus_hot_spots/hot_spots', function(req, res, next) {
    var locations = req.body.locations;
    var radius = req.body.radius;

    hotspots.getBusHotSpots(locations, radius, function(err, locationInfo) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(locationInfo));
        } else {
            cb(err);
        }
    });
});

router.get('/bus_hot_spots/trips/:agency_key/:route_id/:direction_id', function(req, res, next) {
    var agency_key = req.params.agency_key;
    var route_id = req.params.route_id;
    var direction_id = parseInt(req.params.direction_id);
    gtfs.getTripsByRouteAndDirection(agency_key, route_id, direction_id, [], function(err, trips) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json'); // hello
            res.send(JSON.stringify(trips));
        } else {
            console.log(err);
            throw err;
        }

    });
});

router.get('/bus_hot_spots/shapes/:route_id/:direction_id', function(req, res, next) {
    var agency_key = 'localAgency';
    var route_id = req.params.route_id;
    var direction_id = parseInt(req.params.direction_id);
    gtfs.getTripsByRouteAndDirection(agency_key, route_id, direction_id, [], function(err, trips) {
        if (!err) {
            var distinctShapes = [];

            trips.forEach(function(element, index) {
                if (element.shape_id) {
                    if (distinctShapes.indexOf(element.shape_id) === -1) {
                        distinctShapes.push(element.shape_id);
                    }
                }
            });

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(distinctShapes));
        } else {
            console.log(err);
            throw err;
        }

    });
});

router.get('/bus_hot_spots/coords/:route_id', function(req, res, next) {
    var agency_key = 'localAgency';
    var route_id = req.params.route_id; //hello
    gtfs.getCoordinatesByRoute(agency_key, route_id, function(err, coords) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(coords));
        } else {
            console.log(err);
            throw err;
        }

    });
});

router.get('/bus_hot_spots/routes/:route_id/stops/', function(req, res, next) {
    var agency_key = 'localAgency';
    var route_id = req.params.route_id;
    gtfs.getStopsByRoute(agency_key, route_id, function(err, stops) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(stops));
        } else {
            console.log(err);
            throw err;
        }
    });
});

module.exports = router;