'use strict';

angular.module('oriApp')
    .directive('loginForm', function ($timeout, UtilsService, Auth, OfficesService) {
        return {
            templateUrl: 'app/main/login/login.html',
            restrict: 'E',
            replace:true,
            scope: {
                postLoginFn: '&'
            },
            link: function (scope, element, attrs) {
                scope.signUp = false;
                scope.msg = {};
                scope.user = {};

                if (!Auth.isLoggedIn()) {
                    scope.signUp = true;
                }

                OfficesService
                    .fetchOffices()
                    .then(function(offices) {
                        if (offices && !_.isEmpty(offices.data)) {
                            scope.officesNames = offices.data[0].names.split(',');
                        }
                        scope.officesNames = _.union(["בחר כתובת המשרד"], scope.officesNames);
                        scope.user.office = scope.officesNames[0];
                    });

                scope.login = UtilsService.controlledHandler(function (done) {
                    Auth.login(scope.user)
                        .then(function() {
                            _.isFunction(scope.postLoginFn) && (scope.postLoginFn());
                        })
                        .catch(function() {
                            scope.msg = {
                                isError: true,
                                text: 'דוא״ל או סיסמה שגויים',
                                isVisible: true
                            };
                        })
                        .finally(function() {
                            done();
                        })
                });


                scope.createUser = UtilsService.controlledHandler(function (done) {
                    if (scope.user.office === scope.officesNames[0]) {
                        scope.msg = {
                            isError: true,
                            text: 'בחר כתובת המשרד',
                            isVisible: true
                        };
                        done();
                    } else {
                        scope.user.password= scope.user.phone;

                        Auth.createUser(scope.user)
                            .then(function() {
                                scope.msg = {
                                    isError: false,
                                    text: 'ההרשמה הסתיימה בהצלחה, לחץ על שלח את ההזמנה על מנת לסיים את ההזמנה',
                                    isVisible: true
                                };
                                $timeout(function() {
                                    _.isFunction(scope.postLoginFn) && (scope.postLoginFn());
                                },1000)
                            })
                            .catch(function() {
                                scope.msg = {
                                    isError: true,
                                    text: 'היתה בעיה ביצירת משתמש חדש, אנא בדוק שכל הנתונים מלאים ונכונים ונסה שנית',
                                    isVisible: true
                                };
                            })
                            .finally(function() {
                                done();
                            })
                    }
                });

                scope.changeMode = function(signUp) {
                    scope.msg = {};
                    scope.signUp = signUp;
                }
            }
        };
    });
