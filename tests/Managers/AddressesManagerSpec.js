describe('Addresses Manager client side test', function () {
    var _addressesManager,
        _mockedGoogleGeocoder;

    beforeEach(function () {
        window.google = {maps:{GeocoderStatus:{OK: 3}}};
        _addressesManager = busMapping.AddressesManager;
        _mockedGoogleGeocoder = getMockedGoogleGeocoder();
    });

    /**
     * @covers RouteManager.getGeocodedAddress(), RouteManager.setGoogleGeocoder()
     */
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

    describe('geocodeAddress', function() {
        it("should, when succeeding, do the appropriate expected behaviour", function() {
            var eventDispatched = undefined;
            spyOn(document, 'dispatchEvent').and.callFake(function(event) {
                eventDispatched = event;
            });
            _addressesManager.geocodeAddress('saitan');
            expect(document.dispatchEvent).toHaveBeenCalled();
            expect(eventDispatched instanceof CustomEvent).toBeTruthy();
            var geocodedAddress = _addressesManager.getGeocodedAddress('saitan');
            expect(geocodedAddress).toEqual({
                lat: 3.3,
                lng: 3.2
            });
        });

        it("should, when failing, console log the error", function() {
            _mockedGoogleGeocoder.status = 2;
            spyOn(console, 'log');
            _addressesManager.setGoogleGeocoder(_mockedGoogleGeocoder);
            _addressesManager.geocodeAddress('new york');
            expect(console.log).toHaveBeenCalled();
            var geocodedAddress = _addressesManager.getGeocodedAddress('new york');
            expect(geocodedAddress).toEqual(undefined);
        });
    });
});