(function (namespace) {
    "use strict";

    /**
     * Manages routes
     */
    namespace.RouteManager = (function () {
        /**
         * A constant for the API base of routes
         * @type {string}
         */
        var ROUTES_API_BASE = '/bus_hot_spots/routes';

        /**
         * Contains the route database, by location
         * @type {Object}
         * @private
         */
        var _routeDatabase = {};

        /**
         * The event name for finishing populating the routes
         * @type {string}
         * @private
         */
        var _finishedPopulatingEventName = 'got_routes';

        /**
         * Returns the custom event for finishing populating routes, the details include the locationId
         * @param locationId
         * @returns {CustomEvent}
         * @private
         */
        var _getFinishedPopulatingEvent = function (locationId) {
            return new CustomEvent(_finishedPopulatingEventName, {'detail': locationId})
        };

        /**
         * Dispatches the event for finishing population of routes
         * @param {String} locationId
         * @private
         */
        var _dispatchFinishingPopulationEvent = function(locationId) {
            var eventToDispatch = _getFinishedPopulatingEvent(locationId);
            document.dispatchEvent(eventToDispatch);
        };

        /**
         * Gets routes for location
         *
         * @param {google.maps.LatLng} location - LatLng object from google maps
         * @param {int} walkingRadius - the walking radius
         * @private
         */
        var _getRoutesForLocationPromise = function (location, walkingRadius) {
            var latitude = location.lat();
            var longitude = location.lng();
            var url = ROUTES_API_BASE + '/' + latitude + '/' + longitude + '/' + walkingRadius;
            return jQuery.get(url);
        };

        /**
         * Populates the routes into this manager object
         *
         * @param {String} locationId
         * @param {google.maps.LatLng} location
         * @param {int} walkingRadius
         */
        var populateRoutes = function (locationId, location, walkingRadius) {
            var routePromise = _getRoutesForLocationPromise(location, walkingRadius);

            routePromise.then(function (routes) {
                _routeDatabase[locationId] = routes;
                _dispatchFinishingPopulationEvent(locationId);
            });
        };

        /**
         * Wipe the routes
         * TODO: why do this? probably some sort of an infrastructure issue - check how you can resolve it.
         */
        var wipeRoutes = function() {
            _routeDatabase = {};
        };

        /**
         * Gets routes by location Id, or undefined if we didn't get them.
         * @param {String} locationId
         * @returns {Array|undefined}
         */
        var getRoutes = function (locationId) {
            var routes = undefined;
            if (_routeDatabase[locationId]) {
                routes = _routeDatabase[locationId];
            }
            return routes;
        };

        /**
         * Returns the finished event name for population
         * @returns {String}
         */
        var getFinishedEventName = function () {
            return _finishedPopulatingEventName;
        };

        return {
            getRoutes: getRoutes,
            populateRoutes: populateRoutes,
            getFinishedEventName: getFinishedEventName
        };
    })();
})(window.busMapping = window.busMapping || {});
