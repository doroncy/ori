'use strict';

/**
 * @ngdoc service
 * @name oriApp.factory:UtilsService
 * @description
 * Collection of reusable utilities functions
 */

/* @ngInject */
angular
    .module('oriApp')
    .factory('UtilsService', function () {
        var UtilsService = {};

        /**
         * @ngdoc function
         * @name oriApp.factory.UtilsService:controlledHandler
         * @methodOf oriApp.factory:UtilsService
         * @param {func} fn The function to execute when not busy
         * @returns {function} function with is busy validation wrap
         *
         * @description
         * Generates a function that wraps the input function and execute the input function if its not busy.
         * busy is from the time that the function was triggered until manually a call to done() is made.
         * the input function is being triggered with the arguments that passed to the wrapping function with additional
         * done function (for setting the function to not busy).
         */
        UtilsService.controlledHandler = function controlledHandler(fn) {
            return function () {
                var _this = this;
                var args = _.toArray(arguments);
                args.push(function() {
                    _this.busy = false;
                });

                if (!_this.busy) {
                    _this.busy = true;
                    fn.apply(_this, args);
                }
            };
        };


        return UtilsService;
    });


