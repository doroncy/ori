(function() {
    'use strict';

    angular
        .module('oriApp')
        .controller('AdminCtrl', AdminCtrl);

    function AdminCtrl($scope, $q, $state, Auth, AdminService, ModalService) {

        if (!Auth.isAdmin()) {
            $state.go('login');
        }

        $scope.items = AdminService.items;
        $scope.orders = AdminService.orders;
        $scope.switchOptions = { size: 'small' };
        $scope.itemForm = "/app/admin/item-form/item-form.html";
        $scope.currUser = Auth.getCurrentUser();

        $scope.updateItems = function() {
            var promises = [];
            _.forEach($scope.items.list, function (item) {
                promises.push(AdminService.updateItem(item));
            });

            $q.all(promises)
                .then(function() {
                    console.log('all updated');
                })
                .catch(function(err){
                    console.log('error', err);
                    AdminService.fetchItems();
                })
        };

        $scope.openItemForm = function (itemToEdit) {
            var popUpTitle = "";
            var isNewItem = false;
            var item = {};

            if (!!itemToEdit) {
                if (!$scope.editMode) return;

                popUpTitle = "עדכון מוצר " + itemToEdit.name;
                item = _.clone(itemToEdit);
            }else {
                popUpTitle = "הוספת מוצר חדש";
                var isNewItem = true;
            }

            ModalService
                .open({
                    title: popUpTitle,
                    message: {
                        templateUrl: 'app/admin/item-form/item-form.html',
                        options: {
                            item: item,
                            actionFn: function(data) {
                                var defer = $q.defer();

                                var promise = isNewItem
                                    ? AdminService.createItem(data.item)
                                    : AdminService.updateItem(data.item);

                                promise
                                    .then(function() {
                                        defer.resolve({successMsg: 'עודכן בהצלחה'});
                                    })
                                    .catch(function(err) {
                                        defer.reject({errorMsg: 'היתה שגיאה'});
                                    });

                                return defer.promise;
                            }
                        }
                    }
                }).then(function() {
                    AdminService.fetchItems();
                });
        };

        $scope.logout = function() {
            Auth.logout();
            $state.go('login');
        };

        $scope.toggleAsDelivered = function(order) {
            var newStatus = order.status === 'delivered'
                ? 'submited'
                : 'delivered';

            AdminService.updateOrderStatus(order, newStatus);
        };

    }
})();

