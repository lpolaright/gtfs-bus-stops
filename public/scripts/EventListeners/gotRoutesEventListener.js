(function (routeManager, stopsManager) {
    "use strict";

    document.addEventListener('got_routes', function(event) {
        var routesByLocationId = routeManager.getRoutes(event.detail);
        stopsManager.populateStopsForAllRoutes(routesByLocationId);
    });
})(routeManager, stopsManager);