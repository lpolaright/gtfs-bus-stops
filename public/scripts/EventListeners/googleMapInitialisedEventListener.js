(function (googleMapsApiManager, drawingManager, addressesManager) {
    "use strict";

    document.addEventListener('google_map_initialised', function() {
        var googleMap = googleMapsApiManager.getGoogleMap();
        var googleGeocoder = googleMapsApiManager.getGoogleGeocoder();
        drawingManager.setMap(googleMap);
        addressesManager.setGoogleGeocoder(googleGeocoder);
    });
})(googleMapsApiManager, drawingManager, addressesManager);