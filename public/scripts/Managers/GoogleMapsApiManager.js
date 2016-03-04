(function(namespace) {
    "use strict";

    /**
     * Google Maps Api Manager, deals with Google Maps API main objects (geocoder, map, etc.)
     * @constructor
     */
    namespace.GoogleMapsApiManager = (function() {
        /**
         * The map configuration
         * @type {{center: {lat: number, lng: number}, zoom: number}}
         * @private
         */
        var _MAP_CONFIG = {
            center: {lat: 32.085300, lng: 34.851612},
            zoom: 8
        };

        /**
         * The google map (undefined if not initialised)
         * @type {google.maps.Map}
         * @private
         */
        var _googleMap = undefined;

        /**
         * The google geocoder (undefined if not initialised)
         * @type {google.maps.Geocoder}
         * @private
         */
        var _googleGeocoder = undefined;

        /**
         * The map display element
         * @type {jQuery}
         * @private
         */
        var _$mapDisplayElement = undefined;

        /**
         * The event name for finishing populating the routes
         * @type {string}
         * @private
         */
        var _googleMapInitalisedEventName = 'google_map_initialised';

        /**
         * Returns the custom event for initialising the google map
         * @returns {CustomEvent}
         * @private
         */
        var _getFinishedPopulatingEvent = function () {
            return new CustomEvent(_googleMapInitalisedEventName, {'detail': 'initalised'})
        };

        /**
         * Dispatches the event for finishing the initialising of the google map
         * @private
         */
        var _dispatchFinishingPopulationEvent = function() {
            var eventToDispatch = _getFinishedPopulatingEvent();
            document.dispatchEvent(eventToDispatch);
        };

        /**
         * Initialises the google maps api, including the geocoder and google map
         */
        var initialiseGoogleMapsApi = function() {
            var htmlElement = _$mapDisplayElement[0];
            _googleMap = new google.maps.Map(htmlElement, _MAP_CONFIG);
            _googleGeocoder = new google.maps.Geocoder();
            _dispatchFinishingPopulationEvent();
        };

        /**
         * Sets the map display element
         * @param {jQuery} $mapDisplayElement
         */
        var setMapDisplayElement = function($mapDisplayElement) {
            _$mapDisplayElement = $mapDisplayElement;
        };

        /**
         * Gets the google map
         * @returns {google.maps.Map}
         */
        var getGoogleMap = function() {
            return _googleMap;
        };

        /**
         * Gets the google geocoder
         * @returns {google.maps.Geocoder}
         */
        var getGoogleGeocoder = function() {
            return _googleGeocoder;
        };

        return {
            initialiseGoogleMapsApi: initialiseGoogleMapsApi,
            setMapDisplayElement: setMapDisplayElement,
            getGoogleGeocoder: getGoogleGeocoder,
            getGoogleMap: getGoogleMap
        };
    })();
})(window.busMapping = window.busMapping || {});