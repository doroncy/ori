(function() {
    'use strict';

    angular
        .module('oriApp')
        .controller('UsersCtrl', UsersCtrl);

    function UsersCtrl($scope, User, OfficesService) {
        $scope.users = User.query();
        $scope.offices = {
            names: ''
        };

        OfficesService
            .fetchOffices()
            .then(function(officesData) {
                if (!_.isEmpty(officesData.data)) {
                    $scope.offices = officesData.data[0];
                }
            });

        $scope.updateOffices = function () {
            if ($scope.offices._id) {
                OfficesService
                    .updateOffices($scope.offices)
                    .then(showSuccessMsg)
                    .catch(showErrorMsg);
            } else {
                OfficesService
                    .createOffices($scope.offices)
                    .then(showSuccessMsg)
                    .catch(showErrorMsg);
            }

        };

        function showSuccessMsg() {
            $scope.msg = {
                text: "רשימת הכתובות עודכנה",
                isError: false,
                isVisible: true
            };
        }

        function showErrorMsg() {
            $scope.msg = {
                text: "היתה שגיאה, נסה שנית",
                isError: true,
                isVisible: true
            };
        }


    }
})();

