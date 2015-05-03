'use strict';

/**
 * @ngdoc service
 * @name shineCommon.service:ModalService
 * @description
 * Authentication Service
 */

/* @ngInject */
angular.module('oriApp')
    .service('ModalService', function ModalService($modal, $q) {
        var ModalService = {};

        var openModals = {};

        /**
         * @ngdoc function
         * @name shineCommon.service.ModalService:open
         * @methodOf shineCommon.service:ModalService
         * @param {object} options (templateUrl, showCancelButton, title, message)
         * @description
         * Authenticate user
         * @returns {promise} resolves if ok button was clicked and reject if the cancel button was clicked
         */
        ModalService.open = function(options) {
            options = options || {};
            options.backdrop = _.isUndefined(options.backdrop)
                ? true
                : options.backdrop;
            !options.templateUrl && (options.templateUrl = 'components/modal/modal.html');

            return $modal.open({
                templateUrl: options.templateUrl,
                controller: 'ModalCtrl',
                resolve: {
                    showCancelButton: function () {
                        return !!options.showCancelButton;
                    },
                    title: function () {
                        return options.title || "";
                    },
                    message: function () {
                        return options.message;
                    }
                },
                backdrop: options.backdrop
            }).result;
        };

        function generateReadableErrorMsgFromErrorObj(error) {
            var options = {
                title: error.statusText,
                message: []
            };

            _.forEach(error.data, function(errorItem, errorItemKey) {
                options.message.push({
                    title: errorItemKey,
                    messages: _.isArray(errorItem)
                        ? errorItem
                        : [errorItem]
                });
            });

            if (_.isEmpty(options.message)) {
                options.message.push({
                    title: error.statusText,
                    messages: [error.statusText]
                });
            }

            return options;
        }

        /**
         * @ngdoc function
         * @name shineCommon.service.ModalService:showErrorMsg
         * @methodOf shineCommon.service:ModalService
         * @param {object} options (templateUrl, showCancelButton, title, message)
         * @description
         * Handle error modal messages. shows the modal according to the error events params (title, description, status)
         * The service open only new modals and discard existing open modals.
         * @returns {promise} resolves if ok button was clicked and reject if the cancel button was clicked
         */
        ModalService.showErrorMsg = function(error) {
            var defer = $q.defer();
            var options = error || {};

            if (!error) {
                defer.reject();
            } else {
                if (_.isObject(error.data)) {
                    options = generateReadableErrorMsgFromErrorObj(error)
                } else if (_.isObject(error)) {
                    options.title = error.title || error.statusText || error.status || 'Server Error';
                    options.message = error.detail || error.message || error.description ||  error.data || '';
                } else {
                    options.title = 'Server Error';
                    options.message = error;
                }

                if (_.isEmpty(options.message) || _.has(openModals, error.title)) {
                    defer.reject();
                } else {
                    openModals[error.title] = error;
                    ModalService.open(options)
                        .then(function(result) {
                            defer.resolve(result);
                        })
                        .catch(function (error) {
                            defer.reject(error);
                        })
                        .finally(function() {
                            delete openModals[error.title];
                        });
                }
            }

            return defer.promise;
        };

        return ModalService;
    }
);

