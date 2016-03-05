describe('Addresses Manager client side test', function () {
    var _addressesManager,
        _mockedGoogleGeocoder;

    beforeEach(function () {
        window.google = {maps:{GeocoderStatus:{OK: 3}}};
        _addressesManager = busMapping.AddressesManager;
        _mockedGoogleGeocoder = getMockedGoogleGeocoder();
    });

    describe('getGeocodedAddress', function () {
        it("should return undefined if an address doesn't exist in the internal database", function () {
            var geocodedAddress = _addressesManager.getGeocodedAddress('froogle');
            expect(geocodedAddress).toEqual(undefined);
        });

        it("should return an address if one exists in the internal database", function() {
            _addressesManager.setGoogleGeocoder(_mockedGoogleGeocoder);
            _addressesManager.geocodeAddress('tel aviv');
            var geocodedAddress = _addressesManager.getGeocodedAddress('tel aviv');
            expect(geocodedAddress).toEqual({
                lat: 3.3,
                lng: 3.2
            });
        });
    });
});