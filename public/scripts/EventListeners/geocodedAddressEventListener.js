(function (addressesManager, routeManager, drawingManager) {
    "use strict";

    document.addEventListener('geocoded_address', function(event) {
        var address = event.detail;
        var geoCodedAddress = addressesManager.getGeocodedAddress(address);
        drawingManager.setMarkerOnMap(geoCodedAddress);
        routeManager.populateRoutes(address, geoCodedAddress, 0.48);
    });
})(addressesManager, routeManager, drawingManager);