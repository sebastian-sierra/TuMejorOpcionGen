'use strict';
    
var module = angular.module('purchasedGiftCards', ['ngRoute']);

module.controller('PurchasedGiftCardsController',['$window','$scope', '$http', 'DataService',function($window, $scope, $http, DataService) 
{        
    $scope.me = DataService.me;
    
    $scope.giftCards = [];
    
    $scope.init = function ()
    {
        $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/ClientMaster/'+DataService.me.id).
        success(function(response) 
        {
            console.log(response);

            for (var i in response.listpurchasedGiftCards)
            {
                var controller = self;
                var giftCard = response.listpurchasedGiftCards[i];
                
                $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/GiftCard/'+giftCard.shopId).
                success(function(response) 
                {
                    console.log(response);
                    giftCard.shop = response.name;
                });
                $scope.giftCards.push(giftCard);
            }        
        });
    };  
}]);