(function() {
    'use strict';

    angular
        .module('oriApp')
        .factory('OfficesService', OfficesService);

    function OfficesService($q, $http) {
        var OfficesService = {
            createOffices: createOffices,
            fetchOffices: fetchOffices,
            updateOffices: updateOffices
        };

        return OfficesService;

        ////////////////

        function createOffices(officesData) {
            var defer = $q.defer();

            if (officesData && !_.isEmpty(officesData.names)) {
                $http.post('/api/offices/', officesData)
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

        function fetchOffices() {
            return $http.get('/api/offices/');
        }

        function updateOffices(officesData) {
            return $http.patch('/api/offices/' + officesData._id, officesData);
        }

    }
})();



