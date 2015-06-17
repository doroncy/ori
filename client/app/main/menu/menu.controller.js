'use strict';


angular.module('oriApp')
    .controller('MenuCtrl', function ($scope, $anchorScroll, UtilsService, MainService, Auth) {

        $scope.itemsByType = [];
        $scope.showBackdrop = false;

        //order model
        $scope.order = {
            items:[],
            totalPrice: 0,
            showOrder: false,
            showThankyou: false
        };

        function clearOrder() {
            $scope.order.items = [];
            $scope.order.totalPrice = 0;
        }

        $scope.addItemQty = function (item) {
            if (item.amount > 0) {
                item.orderQty = _.isNumber(item.orderQty)
                    ? item.orderQty += 1
                    : 1;
            }
        };

        $scope.orderItem = function(item) {
            var itemInOrder = _.find($scope.order.items, item);

            if (item.amount > 0) {
                if (!itemInOrder) {
                    $scope.addItemQty(item);
                    $scope.order.items.push(item);
                }
                $anchorScroll('main-wrap');
                $scope.order.showOrder = true;
            }
        };

        $scope.logout = function() {
            Auth.logout();
            $scope.currentUser = Auth.getCurrentUser();
        };

        $scope.updateLists = function() {
            MainService.fetchItems()
                .then(function() {
                    clearOrder();

                    $scope.itemsByType = angular.copy([
                        {
                            name: "תבשילים משתנים",
                            list: _.filter(MainService.items.list, {type: "תבשילים משתנים"}),
                            colorClass: 'light-grey'
                        },
                        {
                            name: "כריכים",
                            list: _.filter(MainService.items.list, {type: "כריכים"}),
                            colorClass: 'light-green'
                        },
                        {
                            name: "סלט",
                            list: _.filter(MainService.items.list, {type: "סלט"}),
                            colorClass: 'light-brown'
                        }
                    ]);
                });
        };

        $scope.$watch(function() {
            return $scope.order.showOrder || $scope.order.showThankyou;
        }, function(newValue) {
            if (newValue) {
                $scope.showBackdrop = true;
            } else {
                $scope.showBackdrop = false;
            }
        });

        $scope.closeModals = function() {
            console.log('closeModals');
            $scope.order.showOrder = false;
            $scope.order.showThankyou = false;
        };

        $scope.isListNotEmpty = function (items) {
            items = items || {};
            return !_.isEmpty(items.list);
        };

        // Init
        $scope.currentUser = Auth.getCurrentUser();
        $scope.updateLists();

    });
