'use strict';

/* App Module */

/*config(['$routeProvider', function($routeProvider) {
 $routeProvider.otherwise({redirectTo: '/view1'});
 }]);*/

var adminAppModule = angular.module('adminApp', [
    'ngRoute',
    'adminHomeController'
]);

adminAppModule.factory('DataService', function ()
{
    var dataService = {};

    dataService.validGiftCard=null;

    return dataService;
});

adminAppModule.config(['$routeProvider', '$httpProvider', '$locationProvider',
    function($routeProvider, $httpProvider, $locationProvider)
    {
        //$httpProvider.defaults.useXDomain = true;
        //$httpProvider.defaults.withCredentials = true;
        //delete $httpProvider.defaults.headers.common["X-Requested-With"];
        //$httpProvider.defaults.headers.common["Accept"] = "application/json";
        //$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
        $httpProvider.defaults.headers.common["Accept"] = "application/json";
        $httpProvider.defaults.headers.put["Content-Type"] = "application/json";

        $routeProvider.
            when('/home', {
                templateUrl: 'partials/adminHome.html',
                controller: 'AdminHomeController'
            }).

            when('/validGiftCard', {
                templateUrl: 'partials/validGiftCard.html',
                controller: 'AdminHomeController'
            }).

            otherwise({
                redirectTo: '/home',
                controller: 'AdminHomeController'
            }
        );

}])


