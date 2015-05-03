(function() {
    'use strict';

    angular
        .module('oriApp')
        .controller('AdminLoginCtrl', AdminLoginCtrl);

    function AdminLoginCtrl($scope, $q, UtilsService, Auth, $state) {

        $scope.msg = {};
        $scope.user = {};

        Auth.isLoggedInAsync(function(loggedIn) {
            if(loggedIn && Auth.isAdmin()) {
                $state.go('admin');
            }
        });

        $scope.login = UtilsService.controlledHandler(function (done) {

            Auth.login($scope.user)
                .then(function() {
                    var defer = $q.defer();
                    Auth.isLoggedInAsync(function(success) {
                        if (success) {
                            defer.resolve();
                        } else {
                            defer.reject();
                        }
                    });
                    return defer.promise;
                })
                .then(function() {
                    if (Auth.isAdmin()) {
                        $state.go('admin');
                    } else {
                        Auth.logout();
                        $scope.msg = {
                            isError: true,
                            text: 'אין לך הרשאת כניסה',
                            isVisible: true
                        };
                    }
                })
                .catch(function() {
                    Auth.logout();
                    $scope.msg = {
                        isError: true,
                        text: 'דוא״ל או סיסמה שגויים',
                        isVisible: true
                    };
                })
                .finally(function() {
                    done();
                })

        });

    }
})();

