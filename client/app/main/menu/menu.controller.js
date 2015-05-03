'use strict';


angular.module('oriApp')
    .controller('MenuCtrl', function ($scope, UtilsService, MainService, Auth, ModalService, $state) {
        $scope.items = MainService.items;
        $scope.currentUser = Auth.getCurrentUser();


        $scope.addItemQty = function (item) {
            if (item.amount > 0) {
                item.orderQty = _.isNumber(item.orderQty)
                    ? item.orderQty += 1
                    : 1;
            }
        };

        $scope.subtractItemQty = function (item) {
            if (item.orderQty > 0) {
                item.orderQty = _.isNumber(item.orderQty) && item.orderQty > 0
                    ? item.orderQty -= 1
                    : 0;
            }
        };

        $scope.submitOrder = UtilsService.controlledHandler(function (done) {
            var promise;

            if (Auth.isLoggedIn()) {
                promise = showOrderSummary();
            } else {
                promise = login()
                    .then(showOrderSummary)
                    .then(function() {
                        $scope.currentUser = Auth.getCurrentUser();
                    });
            }

            promise.finally(function() {
                done();
            })
        });

        $scope.logout = function() {
            Auth.logout();
            $scope.currentUser = Auth.getCurrentUser();
        };

        function login() {
            return ModalService
                .open({
                    title: "הרשם לאתר",
                    message: {
                        templateUrl: '/app/main/login/login.html',
                        showFooter: false,
                        options: {
                        }
                    }
                });
        }



        function showOrderSummary() {

            var order = MainService.generateOrder();

            if (order.items.length == 0) {
                return ModalService
                    .open({
                        title: "סיכום הזמנה",
                        message: {
                            options: {
                                text: 'לא נבחרו פריטים',
                                okCaption: 'סגור',
                                showCancelBtn: false
                            }
                        }
                    });
            } else {
                return ModalService
                    .open({
                        title: "סיכום הזמנה",
                        message: {
                            templateUrl: '/app/main/menu/confirm-form.html',
                            options: {
                                order:  order,
                                okCaption: 'הזמן',
                                actionFn: function() {
                                    return MainService.submitOrder(order);
                                }
                            }
                        }
                    })
                    .then(function() {
                        return MainService.fetchItems();
                    })
            }


        }
    });
