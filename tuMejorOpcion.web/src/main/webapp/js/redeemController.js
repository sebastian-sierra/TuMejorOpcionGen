'use strict';
    
var module = angular.module('completedPurchase', ['ngRoute']);

module.controller('CompletedPurchaseController',['$window','$scope', '$http', '$routeParams', 'DataService',function($window, $scope, $http, $routeParams, DataService) 
{        
    $scope.friend = DataService.selectedFriend;
    $scope.redeemSuccess = false;
    
    $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/GiftCard/'+$routeParams.giftCardID).
    success(function(giftCard) 
    {
        if (giftCard !== null && giftCard.id === $routeParams.giftCardID)
        {
            $scope.redeemSuccess = true;
        }
    });                 
}]);