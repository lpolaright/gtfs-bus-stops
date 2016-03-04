(function (namespace) {
    "use strict";

    /**
     * This service draws into a map
     */
    namespace.DrawingManager = (function () {
        /**
         * @type {Map} Google map
         * @private
         */
        var _map;

        /**
         * @type {int} the color offset
         * @private
         */
        var _colorOffset = 0;

        /**
         * A list of available colors
         *
         * @type {string[]}
         * @private
         */
        var _availableColors = [
            '#000000',
            '#ff0000',
            '#0000ff',
            '#00ff00',
            '#f0000f',
            '#f0f0f0'
        ];

        /**
         * Sets the map for drawing
         *
         * @param {Map} map
         * @public
         */
        var setMap = function (map) {
            _map = map;
        };

        /**
         * Changes the color of drawing
         * @public
         */
        var changeColor = function () {
            _colorOffset += 1;
        };

        /**
         * Draws a circle on the map, returns the object.
         *
         * @param {google.maps.LatLng} center
         * @returns {google.maps.Circle}
         * @public
         */
        var drawCircle = function (center) {
            var drawingColor = _getDrawingColor();
            return new google.maps.Circle({
                center: center,
                map: _map,
                fillColor: drawingColor,
                fillOpacity: 0.10,
                radius: 100,
                strokeColor: drawingColor,
                strokeOpacity: 0.3,
                strokeWeight: 1
            });
        };

        /**
         * Sets marker on map
         *
         * @param {google.maps.LatLng} latLng
         */
        var setMarkerOnMap = function (latLng) {
            // TODO: consider saving markers in an array to later on fetch information on them
            var marker = new google.maps.Marker({
                map: _map,
                position: latLng
            });
        };

        /**
         * Return the drawing color
         *
         * @returns {string}
         * @private
         */
        var _getDrawingColor = function () {
            var drawingColor = '#000000';
            if (_availableColors[_colorOffset - 1]) {
                drawingColor = _availableColors[_colorOffset - 1];
            }
            return drawingColor;
        };

        return {
            setMap: setMap,
            drawCircle: drawCircle,
            changeColor: changeColor,
            setMarkerOnMap: setMarkerOnMap
        };
    })();
})(window.busMapping = window.busMapping || {});