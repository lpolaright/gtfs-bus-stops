function getMockedGoogleGeocoder() {

    var googleGeocoder = jasmine.createSpyObj('google.maps.Geocoder', [
        'geocode'
    ]);

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

        var status = 3;

        handler(results, status);
    });

    return googleGeocoder;
}