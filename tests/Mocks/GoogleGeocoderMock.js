function getMockedGoogleGeocoder() {

    var googleGeocoder = jasmine.createSpyObj('google.maps.Geocoder', [
        'geocode'
    ]);

    googleGeocoder.status = 3;

    googleGeocoder.geocode.and.callFake(function(request, handler) {
        var results = [
            {
                geometry: {
                    location: {
                        lat: 3.3,
                        lng: 3.2
                    }
                }
            }
        ];

        handler(results, googleGeocoder.status);
    });

    return googleGeocoder;
}