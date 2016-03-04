// Initialise the controller
var inputController = new busMapping.inputController();

// Initialise the managers
var routeManager = busMapping.RouteManager;
var stopsManager = busMapping.StopsManager;
var drawingManager = busMapping.DrawingManager;
var addressesManager = busMapping.AddressesManager;
var googleMapsApiManager = busMapping.GoogleMapsApiManager;

// Set the jQuery elements
var $locationInputWrapper = jQuery('.location_input_wrapper'),
    $mapDisplay = jQuery('.map_display');

// TODO: Fix the input controller
googleMapsApiManager.setMapDisplayElement($mapDisplay);
inputController.init(addressesManager, drawingManager);
inputController.bindAddLocationActions($locationInputWrapper);