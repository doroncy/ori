'use strict';

angular.module('oriApp', [
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngTouch',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'NgSwitchery'
])
    .config(function ($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'app/main/welcome/welcome.html',
                controller: 'WelcomeCtrl'
            })
            .state('menu', {
                url: '/menu',
                templateUrl: 'app/main/menu/menu.html',
                controller: 'MenuCtrl',
                resolve: {
                    MainServiceInit : ['MainService', function(MainService) {
                        return MainService.fetchItems();
                    }]
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/admin/login/login.html',
                controller: 'AdminLoginCtrl'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminCtrl',
                resolve: {
                    AdminServiceInit : ['AdminService', function(AdminService) {
                        return AdminService.init();
                    }]
                }
            });

        $urlRouterProvider
            .otherwise('/');
    })

    .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if(response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookieStore.remove('token');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        };
    });