function getMockedGoogleMapsNamespace() {
    var googleMapsNamespace = jasmine.createSpyObj('google.maps.Geocoder', [
        'Marker', 'Circle'
    ]);

    googleMapsNamespace.Marker.and.callFake(function(request) {
        return request;
    });

    googleMapsNamespace.Circle.and.callFake(function(request) {
        return request;
    });

    return googleMapsNamespace;
}
