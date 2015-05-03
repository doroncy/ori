'use strict';

/* @ngInject */
angular
    .module('oriApp')
    .controller('ModalCtrl', function ($scope, $modalInstance, showCancelButton, title, message) {
        $scope.title = title;
        $scope.showCancelButton = showCancelButton;
        $scope.showFooter = true;
        $scope.showCancelBtn = true;
        $scope.messageTemplateUrl = '';
        $scope.options = {};
        $scope.okCaption = 'שמור';


        if (_.isArray(message)) {
            $scope.messagesList = message;
        } else if (_.isObject(message)) {
            $scope.showFooter = _.isBoolean(message.showFooter)
                ? message.showFooter
                : true;
            $scope.options = message.options || {};
            $scope.messageTemplateUrl = message.templateUrl || '';
            $scope.okCaption = $scope.options.okCaption || 'שמור';
            $scope.message = message.options.text;
            $scope.showCancelBtn = _.isBoolean(message.options.showCancelBtn)
                ? message.options.showCancelBtn
                : true;
        } else {
            $scope.message = message;
        }

        $scope.ok = function () {
            if (_.isFunction($scope.options.actionFn)){
                $scope.options.actionFn($scope.options)
                    .then(function(data) {
                        if (data.successMsg) {
                            $scope.errorMsg = null;
                            $scope.successMsg = data.successMsg;
                            showOnlyCloseBtn();
                        } else {
                            $modalInstance.close();
                        }
                    })
                    .catch(function(err) {
                        $scope.errorMsg = err || "אופס, היתה שגיאה";
                        showOnlyCloseBtn();
                    })
            } else {
                $modalInstance.close();
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function showOnlyCloseBtn() {
            $scope.okCaption = "סגור";
            $scope.options.actionFn = null;
            $scope.showCancelBtn = false;
        }
    });
