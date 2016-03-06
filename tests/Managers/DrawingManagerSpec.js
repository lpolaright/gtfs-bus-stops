describe('Addresses Manager client side test', function () {
    var _drawingManager,
        _mockedGoogleNameSpace;

    beforeEach(function () {
        _drawingManager = busMapping.DrawingManager;
        _mockedGoogleNameSpace = getMockedGoogleMapsNamespace();
        _drawingManager.setGoogleMapsNamespace(_mockedGoogleNameSpace);
        _drawingManager.setMap('map');
    });

    describe('drawCircle', function() {
        it("should draw a circle on the map using google maps", function() {
            var drawnCircle = _drawingManager.drawCircle('latLngTest');
            expect(_mockedGoogleNameSpace.Circle).toHaveBeenCalled();
            expect(drawnCircle).toEqual({
                center: 'latLngTest',
                map: 'map',
                fillColor: '#000000',
                fillOpacity: 0.10,
                radius: 100,
                strokeColor: '#000000',
                strokeOpacity: 0.3,
                strokeWeight: 1
            });
        });
    });

    describe('setMarkerOnMap', function() {
        it("should set a marker on the map using google maps", function() {
            var marker = _drawingManager.setMarkerOnMap('marker');
            expect(_mockedGoogleNameSpace.Marker).toHaveBeenCalled();
            expect(marker).toEqual({
                map: 'map',
                position: 'marker'
            });
        });
    });

    describe('changeColor', function() {
        it("should change a color of the objects we draw on the google map", function() {
            var drawnCircle = _drawingManager.drawCircle('latLngTest');
            _drawingManager.changeColor();
            var drawnCircle2 = _drawingManager.drawCircle('latLngTest2');
            expect(drawnCircle.fillColor).not.toEqual(drawnCircle2.fillColor);
            expect(drawnCircle.strokeColor).not.toEqual(drawnCircle2.strokeColor);
        });
    });
});