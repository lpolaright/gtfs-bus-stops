(function (namespace) {
    "use strict";

    /**
     * This manager keeps addresses managed
     */
    namespace.AddressesManager = (function () {
        /**
         * Contains the addresses database, location id => coordinates
         * @type {Object}
         * @private
         */
        var _addressesDatabase = {};

        /**
         * The google Geocoder
         * @type {google.maps.Geocoder}
         * @private
         */
        var _googleGeocoder = undefined;

        /**
         * The event name for finishing geocoding an address
         * @type {string}
         * @private
         */
        var _finishedGeocodingEventName = 'geocoded_address';

        /**
         * Returns the custom event for finishing geocoding an address, the details include the address string
         * @param {String} address
         * @returns {CustomEvent}
         * @private
         */
        var _getGeocodedAddressEvent = function (address) {
            return new CustomEvent(_finishedGeocodingEventName, {'detail': address})
        };

        /**
         * Dispatches the event for finishing population of routes
         * @param {String} address
         * @private
         */
        var _dispatchFinishingGeocodingEvent = function(address) {
            var eventToDispatch = _getGeocodedAddressEvent(address);
            document.dispatchEvent(eventToDispatch);
        };

        /**
         * Sets the google geocoder
         * @param {google.maps.Geocoder} googleGeocoder
         */
        var setGoogleGeocoder = function(googleGeocoder) {
            _googleGeocoder = googleGeocoder;
        };

        /**
         * Geocodes an address, when finished - dispatches an event to let us know we are done
         * @param {String} address
         */
        var geocodeAddress = function(address) {
            var request = {
                'address': address
            };
            _googleGeocoder.geocode(request, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // TODO: deal with what happens when there are several results
                    _addressesDatabase[address] = results[0].geometry.location;
                    _dispatchFinishingGeocodingEvent(address);
                } else {
                    // TODO: Deal with errors smarter and UI
                    console.log('error occured in geocoding the address: ' + address);
                }
            });
        };

        /**
         * Gets the geocoded address
         * @param {String} address
         * @return {google.maps.LatLng}
         */
        var getGeocodedAddress = function(address) {
            var geocodedResult = undefined;
            if (_addressesDatabase[address]) {
                geocodedResult = _addressesDatabase[address];
            }
            return geocodedResult;
        };

        return {
            geocodeAddress: geocodeAddress,
            setGoogleGeocoder: setGoogleGeocoder,
            getGeocodedAddress: getGeocodedAddress
        };
    })();
})(window.busMapping = window.busMapping || {});