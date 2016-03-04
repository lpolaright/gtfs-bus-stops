var async = require('async');
var gtfs = require('gtfs');
var geolib = require('geolib');
var monq = require('monq');
//var client = monq('mongodb://localhost:27017/gtfs');
//var queue = client.queue('bus_hot_spots');

/**
 * Stats the bus hot spots compare queue
 *
 * @param locations
 * @param radius
 * @param callback
 */
var startBusHotSpotsCompare = function(locations, radius, callback) {
    var routeIdsByLocation = {};

    async.each(locations, locationsIterator, locationsFinished);

    function locationsIterator(location, callback) {
        gtfs.getRoutesByDistance(location.lat, location.lng, radius, function(err, routes) {
            if(!err) {
                routeIdsByLocation[location.id] = routes;
                callback(null, 'routes');
            } else {
                callback(err);
            }
        });
    }

    function locationsFinished(err) {
        if (!err) {
            //
            for (var locationId in routeIdsByLocation) {
                if (routeIdsByLocation.hasOwnProperty(locationId)) {
                    var primaryRoutes = routeIdsByLocation[locationId];
                    primaryRoutes.forEach(function(primaryRoute) {
                        for (var secondaryLocationId in routeIdsByLocation) {
                            if (locationId === secondaryLocationId) {
                                continue;
                            }
                            if (routeIdsByLocation.hasOwnProperty(secondaryLocationId)) {
                                var secondaryRoutes = routeIdsByLocation[secondaryLocationId];
                                secondaryRoutes.forEach(function(secondaryRoute) {
                                    var comparingJob = {
                                        route_1: primaryRoute.route_id,
                                        route_2: secondaryRoute.route_id
                                    };
                                    queue.enqueue('route_compare', comparingJob);
                                });
                            }
                        }
                    });
                }
            }
        } else {
            callback(err);
        }
    }
};

var getBusHotSpots = function(locations, radius, callback) {
    this.getAllLocationsRoutes(locations, radius, busHotSpotsIterator);

    function busHotSpotsIterator(err, locationsInfo) {
        if (!err) {
            var hotSpots = [];

            for (var locationKey in locationsInfo) {
                if (locationsInfo.hasOwnProperty(locationKey)) {
                    var locationInfo = locationsInfo[locationKey];
                    locationInfo.forEach(function(routeInfo) {
                        var stops = routeInfo.route_stops[0].stops;
                        stops.forEach(function(stop) {
                            for (var secondaryLoations in locationsInfo) {
                                if (locationKey === secondaryLoations) {
                                    continue;
                                }
                                if (locationsInfo.hasOwnProperty(secondaryLoations)) {
                                    var secondarylocationInfo = locationsInfo[secondaryLoations];
                                    secondarylocationInfo.forEach(function(secondaryrouteInfo) {
                                        var secondarystops = secondaryrouteInfo.route_stops[0].stops;
                                        secondarystops.forEach(function(secondary_stop) {
                                            var stopsToCenter = [
                                                {latitude: stop.stop_lat, longitude: stop.stop_lon},
                                                {latitude: secondary_stop.stop_lat, longitude: secondary_stop.stop_lon}
                                            ];
                                            var centeredStop = geolib.getCenter(stopsToCenter);
                                            var primCenterStopDistance = geolib.getDistance({latitude: stop.stop_lat, longitude: stop.stop_lon}, centeredStop) ;
                                            var secnCenterStopDistance = geolib.getDistance({latitude: secondary_stop.stop_lat, longitude: secondary_stop.stop_lon}, centeredStop);

                                            if (primCenterStopDistance * 0.621371 / 1000 <= 0.48 && secnCenterStopDistance * 0.621371 / 1000 <= 0.48) {
                                                hotSpots.push(centeredStop);
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    });
                }
            }


            callback(null, hotSpots);
        }
    }
};

/**
 * Gets all the location routes
 *
 * @param {Array} locations - contains objects with lat and lng, and id
 * @param {Number} radius - is the radius we want to get routes for
 * @param {Function} callback - the callback to use, with err, and routes
 * @return {Object} - returns all locations routes, and their stops
 */
var getAllLocationsRoutes = function(locations, radius, callback) {
    async.each(locations, locationsIterator, locationsFinished);

    var locations_info = {};

    /**
     * Iterate over every location, fetching the routes and their stops.
     *
     * @param {Object} location - lat, lng, id
     * @param {Function} callback - to tell the iteration its done
     */
    function locationsIterator(location, callback) {
        getRoutesAndTheirStopsByDistance(location.lat, location.lng, radius, function(err, stops_by_routes) {
            if (!err) {
                var location_id = location.id;
                locations_info[location_id] = stops_by_routes;
                callback(null, 'got_routes_and_their_stops_by_distance');
            } else {
                callback(err);
            }
        });
    }

    /**
     * Uses the callback function to pass on the information
     *
     * @param err
     */
    function locationsFinished(err) {
        if (!err) {
            callback(null, locations_info);
        } else {
            callback(err);
        }
    }
};

var getRoutesAndTheirStopsByDistance = function(lat, lng, radius, callingback) {

    var routes_to_iterate = [];
    var stops_by_route = [];

    async.series([
        getRoutes,
        getStopsForEveryRoute
    ]);

    function getRoutes (cb) {
        gtfs.getRoutesByDistance(lat, lng, radius, function(err, routes) {
            if (!err) {
                routes_to_iterate = routes;
                cb(null, 'routes_to_iterate');
            } else {
                cb(err);
            }
        });
    }

    function getStopsForEveryRoute(cb) {
        async.each(routes_to_iterate, function(route, cb_2) {
            var route_stops = {
                route_id: route.route_id,
                route_information: route,
                route_stops: []
            };

            gtfs.getStopsByRoute('localAgency', route.route_id, function(err, stops) {
                if (!err) {
                    route_stops.route_stops = stops;
                    stops_by_route.push(route_stops);
                    cb_2();
                } else {
                    cb_2(err);
                }
            });
        }, function(err) {
            if (!err) {
                callingback(null, stops_by_route);
            }
        });
        cb();
    }
};

module.exports = {
    getRoutesAndTheirStopsByDisance: getRoutesAndTheirStopsByDistance,
    getAllLocationsRoutes: getAllLocationsRoutes,
    getBusHotSpots: getBusHotSpots
};