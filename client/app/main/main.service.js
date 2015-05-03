'use strict';

angular.module('oriApp')
    .factory('MainService', function ($q, ItemsService, OrdersService) {
        var MainService = {
            items: {
                list: []
            },
            fetchItems: fetchItems,
            generateOrder: generateOrder,
            submitOrder: submitOrder
        };

        return MainService;

        /////////

        /**
         * Fetch the items and update the service model
         */
        function fetchItems() {
            return ItemsService.fetchItems(true)
                .then(function(items) {
                    MainService.items.list = _.toArray(items);
                });
        }

        function generateOrder() {

            var orderItems = _(MainService.items.list)
                .filter(function(item) {
                    return item.orderQty > 0;
                })
                .map(function(item) {
                    return {
                        id: item._id,
                        name: item.name,
                        quantity: item.orderQty,
                        itemPrice: item.price
                    }
                })
                .value();

            var totalPrice = 0;
            _.forEach(orderItems, function(item) {
                totalPrice += (item.quantity * item.itemPrice);
            });

            return {
                items: orderItems,
                totalPrice: totalPrice
            }

        }

        /**
         * Submit the current order
         */
        function submitOrder(order) {
            var defer = $q.defer();

            if (order && !_.isEmpty(order.items)) {
                OrdersService.createOrder(order)
                    .then(function() {
                        console.log('order created');
                        _.forEach(MainService.items.list, function(item) {
                           item.orderQty = 0;
                        });
                        defer.resolve({successMsg: 'הזמנתך נקלטה בהצלחה'});
                    })
                    .catch(function(err) {
                        var message = "הפריטים הבאים נגמרו במלאי: ";
                        _.forEach(err.data.items, function(item) {
                            message += item + ', ';
                        });
                        defer.reject(message);
                    });
            } else {
                console.log('no orders');
                defer.reject(message);
            }

            return defer.promise;
        }





    });