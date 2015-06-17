'use strict';

angular.module('oriApp')
    .directive('confirmForm', function ($timeout, Auth, MainService) {
      return {
        templateUrl: 'app/confirm-form/confirm-form.html',
        restrict: 'EA',
        scope: {
          order: '=',
          postOrderFn: '&'
        },
        link: function (scope, element, attrs) {
          scope.showThankYou = false;

          scope.addItemQty = function (item) {
            if (item.amount > 0 && item.orderQty < item.amount) {
              item.orderQty = _.isNumber(item.orderQty)
                  ? item.orderQty += 1
                  : 1;
            }
          };

          scope.subtractItemQty = function (item) {
            if (item.orderQty > 0) {
              item.orderQty = _.isNumber(item.orderQty) && item.orderQty > 0
                  ? item.orderQty -= 1
                  : 0;
            }
          };

          scope.calcTotalPrice = function() {
            var totalPrice = 0;
            _.forEach(scope.order.items, function(item) {
              totalPrice += (item.orderQty * item.price);
            });
            return totalPrice;
          };

          scope.isSubmitOrderDisabled = function() {
            return !Auth.isLoggedIn();
          };

          scope.closeOrderForm = function() {
            scope.order.showOrder = false;
          };

          scope.showThankyouMsg = function() {
            scope.order.showThankyou = true;
          };

          scope.SignInComplete = function() {
            Auth.isLoggedInAsync(function() {
              scope.currentUser = Auth.getCurrentUser();
            });
          };

          scope.submitOrder = function() {
            var order = MainService.generateOrder(scope.order.items);

            if (!_.isEmpty(order.items)) {
              MainService.submitOrder(order)
                  .then(function() {
                    _.isFunction(scope.postOrderFn) &&  (scope.postOrderFn());
                    scope.closeOrderForm();
                    $timeout(function() {
                      scope.showThankyouMsg();
                    },500);
                  })
                  .catch(function() {
                    // Show error msg
                    console.log('error in order');
                  });
            }
          };
        }
      };
    });