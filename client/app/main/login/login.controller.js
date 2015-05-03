'use strict';


angular.module('oriApp')
    .controller('LoginCtrl', function ($scope, $timeout, UtilsService, Auth, $state, OfficesService) {

        $scope.signUp = false;
        $scope.msg = {};
        $scope.user = {};

        OfficesService
            .fetchOffices()
            .then(function(offices) {
                if (offices && !_.isEmpty(offices.data)) {
                    $scope.officesNames = offices.data[0].names.split(',');
                }
                $scope.officesNames.push("אחר");
            });


        $scope.gotoSignUp = function() {
            $scope.signUp = true;
        };
        
        $scope.login = UtilsService.controlledHandler(function (done) {

            Auth.login($scope.user)
                .then(function() {
                    $scope.ok();
                })
                .catch(function() {
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


        $scope.createUser = UtilsService.controlledHandler(function (done) {
            Auth.createUser($scope.user)
                .then(function() {
                    $scope.msg = {
                        isError: false,
                        text: 'נרשמת בהצלחה למערכת, מיד תעבור לדף הכניסה...',
                        isVisible: true
                    };
                    $timeout(function() {
                        $scope.ok();
                    },2000)
                })
                .catch(function() {
                    $scope.msg = {
                        isError: true,
                        text: 'היתה בעיה ביצירת משתמש חדש, אנא בדוק שכל הנתונים מלאים ונכונים ונסה שנית',
                        isVisible: true
                    };
                })
                .finally(function() {
                    done();
                })
        });
    });
