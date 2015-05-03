angular.module('oriApp')
    .factory('ItemResource', ['$resource', function ($resource) {
        return $resource('/api/items/:id', {
            id: '@_id'
        }, { //parameters default
            update: {
                method: 'PUT'
            }
        });
    }])
    .factory('ItemsService', function (ItemResource, $q) {
        var ItemsService = {};

        ItemsService.createItem = function createItem(itemData) {
            var deffered = $q.defer();
            var item = new ItemResource(itemData);

            item
                .$save()
                .then(function(newItem) {
                    deffered.resolve(newItem);
                })
                .catch(function(err) {
                    deffered.reject(err);
                });

            return deffered.promise;
        };

        ItemsService.fetchItems = function fetchItems(onlyActive) {
            var deffered = $q.defer();
            var queryParams = _.isBoolean(onlyActive) ? {active: onlyActive} : {};

            var itemsList = ItemResource
                .query(queryParams).$promise
                .then(function(items) {
                    deffered.resolve(items);
                })
                .catch(function(err) {
                    deffered.reject(err);
                });

            return deffered.promise;
        };

        ItemsService.updateItem = function updateItem(itemData) {
            var deffered = $q.defer();

            ItemResource
                .update(itemData).$promise
                .then(function(item) {
                    deffered.resolve(item);
                })
                .catch(function(err) {
                    deffered.reject(err);
                });

            return deffered.promise;
        };


        return ItemsService;
    });


