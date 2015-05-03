'use strict';

angular.module('oriApp')
    .config(function ($stateProvider) {
      $stateProvider
          .state('users', {
            url: '/users',
            templateUrl: 'app/admin/users/users.html',
            controller: 'UsersCtrl'
          });
    });