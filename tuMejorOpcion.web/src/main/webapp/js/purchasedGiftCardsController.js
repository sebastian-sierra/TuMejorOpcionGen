'use strict';
    
var module = angular.module('purchasedGiftCards', ['ngRoute']);

module.controller('PurchasedGiftCardsController',['$window','$scope', '$http', 'DataService',function($window, $scope, $http, DataService) 
{        
    $scope.me = DataService.me;
    
    $scope.giftCards = DataService.purchasedGiftCards;
    
}]);