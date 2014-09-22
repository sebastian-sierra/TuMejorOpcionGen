'use strict';
    
var module = angular.module('completedPurchase', ['ngRoute']);

module.controller('CompletedPurchaseController',['$window','$scope', '$http', 'DataService',function($window, $scope, $http, DataService) 
{        
    $scope.friend = DataService.selectedFriend;
    
    $scope.redirectToGiftCards = function ()
    {
        console.log("redirecting...");
        $window.location.href = '#/giftCards';
    };
                        
}]);