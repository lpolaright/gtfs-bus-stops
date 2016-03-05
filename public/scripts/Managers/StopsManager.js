(function (namespace) {
    "use strict";

    /**
     * Manages routes
     */
    namespace.StopsManager = (function () {
        /**
         * A constant for the API base of stops
         * @type {string}
         */
        var STOPS_API_BASE = '/bus_hot_spots/api/stops';

        /**
         * Contains the stops database, by route_id
         * @type {Object}
         * @private
         */
        var _stopsDatabase = {};

        /**
         * The event name for finishing populating the stops
         * @type {string}
         * @private
         */
        var _finishedPopulatingEventName = 'got_stops';

        /**
         * The event name for finishing populating all of the stops for all of the routes
         * @type {string}
         * @private
         */
        var _finishedPopulatingAllRoutesEventName = 'got_all_stops';

        /**
         * The number of expected routes
         * @type {number}
         * @private
         */
        var _numberOfExpectedRoutes = 0;

        /**
         * The actual number of routes populated stops
         * @type {number}
         * @private
         */
        var _numberOfActualRoutesPopulated = 0;

        /**
         * Returns the custom event for finishing populating stops, the details include the routeId
         * @param {String} routeId
         * @returns {CustomEvent}
         * @private
         */
        var _getFinishedPopulatingEvent = function (routeId) {
            return new CustomEvent(_finishedPopulatingEventName, {'detail': routeId});
        };

        /**
         * Returns the custom event for finishing populating  all of the stops
         * @returns {CustomEvent}
         * @private
         */
        var _getFinishedPopulatingEverythingEvent = function () {
            return new CustomEvent(_finishedPopulatingAllRoutesEventName, {'detail': 'all_finished'});
        };

        /**
         * Dispatches the event for finishing population of stops for a routeId
         * @param {String} routeId
         * @private
         */
        var _dispatchFinishingPopulationEvent = function (routeId) {
            var eventToDispatch = _getFinishedPopulatingEvent(routeId);
            document.dispatchEvent(eventToDispatch);
        };

        /**
         * Dispatches the event for finishing population of all stops for all routes
         * @private
         */
        var _dispatchFinishingAllPopulationEvent = function () {
            var eventToDispatch = _getFinishedPopulatingEverythingEvent();
            document.dispatchEvent(eventToDispatch);
        };

        /**
         * Gets routes for location
         *
         * @param {String} route_id - the route id to fetch stops for
         * @private
         */
        var _getStopsForRoutePromise = function (route_id) {
            var url = STOPS_API_BASE + '/' + route_id;
            return jQuery.get(url);
        };

        /**
         * Populates the routes into this manager object
         *
         * @param {String} routeId
         */
        var populateStops = function (routeId) {
            var stopsPromise = _getStopsForRoutePromise(routeId);
            // TODO: deal with failures, not only successes
            stopsPromise.then(function (stops) {
                _stopsDatabase[routeId] = stops;
                _dispatchFinishingPopulationEvent(routeId);
                _numberOfActualRoutesPopulated += 1;
                // TODO: get this out to the event listener - to count. (it could also check if no response was given lately)
                // We are finished here populating all the routes
                if (_numberOfActualRoutesPopulated === _numberOfExpectedRoutes) {
                    _dispatchFinishingAllPopulationEvent();
                    _numberOfActualRoutesPopulated = 0;
                }
            });
        };

        /**
         * Gets stops by route Id, or undefined if we didn't get them.
         * @param {String} routeId
         * @returns {Object|undefined}
         */
        var getStops = function (routeId) {
            var stops = undefined;
            if (_stopsDatabase[routeId]) {
                stops = _stopsDatabase[routeId];
            }
            return stops;
        };

        /**
         * Gets stops (unique) by route Id, or undefined if we didn't get them.
         * @param {String} routeId
         * @returns {Array|undefined}
         */
        var getUniqueStops = function () {
            var uniqueStops = [];
            var populatedStopsId = [];
            for (var routeId in _stopsDatabase) {
                if (!_stopsDatabase.hasOwnProperty(routeId)) continue;

                var stops = _stopsDatabase[routeId];
                stops.forEach(function(stop) {
                    if (populatedStopsId.indexOf(stop.stop_id) === -1) {
                        populatedStopsId.push(stop.stop_id);
                        uniqueStops.push(stop);
                    }
                });
            }
            return uniqueStops;
        };

        /**
         * Wipes the stops
         * TODO: why do this? probably some sort of an infrastructure issue - check how you can resolve it.
         */
        var wipeStops = function() {
            _stopsDatabase = {};
        };

        /**
         * Returns the finished event name for population
         * @returns {String}
         */
        var getFinishedEventName = function () {
            return _finishedPopulatingEventName;
        };

        /**
         * Returns the finished event name for population of all stops for all routes
         * @returns {string}
         */
        var getFinishedAllEventName = function () {
            return _finishedPopulatingAllRoutesEventName;
        };

        /**
         * Sets the number of expected routes
         * @param {int} numberOfExpectedRoutes
         */
        var setNumberOfExpectedRoutes = function (numberOfExpectedRoutes) {
            _numberOfExpectedRoutes = numberOfExpectedRoutes;
        };

        /**
         * Populates stops for all of the routes (just iterates the routes given)
         * @param {Array} routes - an array of routes
         */
        var populateStopsForAllRoutes = function (routes) {
            setNumberOfExpectedRoutes(routes.length);
            routes.forEach(function (route) {
                var route_id = route.route_id;
                populateStops(route_id);
            });
        };

        return {
            getStops: getStops,
            wipeStops: wipeStops,
            populateStops: populateStops,
            getUniqueStops: getUniqueStops,
            getFinishedEventName: getFinishedEventName,
            getFinishedAllEventName: getFinishedAllEventName,
            setNumberOfExpectedRoutes: setNumberOfExpectedRoutes,
            populateStopsForAllRoutes: populateStopsForAllRoutes
        };
    })();
})(window.busMapping = window.busMapping || {});
