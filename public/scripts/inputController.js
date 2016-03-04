(function (namespace) {
    "use strict";

    /**
     * The controller that controls the inputs
     */
    namespace.inputController = function () {
        var vm = this,
            _drawingManager,
            _addressesManager;

        /**
         * Initialises the controller
         * @param {AddressesManager} addressesManager
         * @param {DrawingManager} drawingManager
         */
        vm.init = function (addressesManager, drawingManager) {
            _addressesManager = addressesManager;
            _drawingManager = drawingManager;
        };


        /**
         * Binds the add location action to various functionalities
         *
         * @param {jQuery} $addLocationWrapper
         */
        vm.bindAddLocationActions = function ($addLocationWrapper) {
            $addLocationWrapper.each(function (index, element) {
                var $element = jQuery(element);
                vm.bindAddLocationAction($element);
            });
        };

        /**
         * Binds the add location actions
         *
         * @param {jQuery} $element
         */
        vm.bindAddLocationAction = function($element) {
            var $button = $element.find('button');
            var $input = $element.find('input');
            $button.on('click', function () {
                _drawingManager.changeColor();
                _addressesManager.geocodeAddress($input.val());
                $input.attr('disabled', true);
                $button.addClass('disappear');
                vm.addInputLocation($element);
            });
        };

        /**
         * Adds an input location after $element
         *
         * @param {jQuery} $element
         */
        vm.addInputLocation = function ($element) {
            var $addInputLocation = jQuery(
                '<div class="location_input_wrapper"><div class="input-group"><input type="text" placeholder="Enter a location" class="form-control"><span class="input-group-btn"><button type="button" class="btn btn-default add_location_button">Go!</button></span></div></div>'
            );
            $element.after($addInputLocation);
            vm.bindAddLocationAction($addInputLocation);
        };
    }
})(window.busMapping = window.busMapping || {});