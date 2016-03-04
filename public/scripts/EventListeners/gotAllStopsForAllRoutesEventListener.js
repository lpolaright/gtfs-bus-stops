(function (stopsManager, drawingManager) {
    "use strict";

    var eventName = stopsManager.getFinishedAllEventName();
    document.addEventListener(eventName, function() {
        var uniqueStopsToDraw = stopsManager.getUniqueStops();
        uniqueStopsToDraw.forEach(function(stop) {
            var latLngCoord = new google.maps.LatLng(stop.stop_lat, stop.stop_lon);
            drawingManager.drawCircle(latLngCoord);
            stopsManager.wipeStops();
        });
    });
})(stopsManager, drawingManager);
