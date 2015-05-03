(function() {
    'use strict';

    angular
        .module('oriApp')
        .factory('OrdersService', OrdersService);

    function OrdersService($q, $http) {
        var OrdersService = {
            createOrder: createOrder,
            fetchOrders: fetchOrders,
            updateOrderStatus: updateOrderStatus
        };

        return OrdersService;

        ////////////////

        function createOrder(orderData) {
            var defer = $q.defer();

            if (orderData && !_.isEmpty(orderData.items)) {
                orderData.date = moment();

                $http.post('/api/orders/', orderData)
                    .then(function() {
                        defer.resolve();
                    })
                    .catch(function(err) {
                        defer.reject(err);
                    });
            } else {
                defer.reject();
            }

            return defer.promise;
        }

        function fetchOrders(options) {
            var defer = $q.defer();
            options = options || {};
            var startDate = options.startDate || moment().startOf('day');
            var endDate = options.endDate || moment().endOf('day');

            $http.get('/api/orders/', {startDate: startDate, endDate: endDate})
                .then(function(orders) {
                    defer.resolve(orders.data);
                })
                .catch(function(err) {
                    defer.reject(err);
                });

            return defer.promise;
        }

        function updateOrderStatus(order, newStatus) {
            return $http.patch('/api/orders/' + order._id, {
                status:newStatus
            });
        }

    }
})();



