'use strict';
    
var module = angular.module('purchasedGiftCards', ['ngRoute']);

module.controller('PurchasedGiftCardsController',['$window','$scope', '$http', 'DataService',function($window, $scope, $http, DataService) 
{        
    $scope.me = DataService.me;
    $scope.friends = DataService.friends;
    
    $scope.giftCards;
    
    $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/GiftCard/').
    success(function(response) 
    {
        console.log(response);
    });
    
}]);