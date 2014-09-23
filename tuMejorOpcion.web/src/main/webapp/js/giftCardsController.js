'use strict';
    
var module = angular.module('giftCards', ['ngRoute']);

module.controller('GiftCardsController',['DataService','$window','$scope', '$http', function(DataService, $window, $scope, $http) 
{    
    $scope.selectedGiftCard = null;     
    $scope.giftCards = [];
    
    $scope.value = 20000;
    
    function GiftCard(shop, price)
    {
        this.shop = shop;
        this.id = shop.id;
        this.price = price;
        this.selected = false;
    }
    
    for (var i in DataService.selectedFriendApplicableShops)
    {
        var shop = DataService.selectedFriendApplicableShops[i];      
        $scope.giftCards.push(new GiftCard(shop, 0));
    }
    
    $scope.redirectToCompletedPurchase = function ()
    {
        console.log("redirecting...");
        $window.location.href = '#/completedPurchase';
    };
    
    $scope.buySelectedGiftCard = function(giftCard)
    {
        var controller = this;
        
        var putData = 
        {  
            clientEntity: 
            {
                id: DataService.me.id
            },
            
            createpurchasedGiftCards:
            {
                value:$scope.value,
                shopId: giftCard.shop.id,
                dateCreated: new Date().getDay()+"/"+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),
                destinaryId: DataService.selectedFriend.id 
            }
        };
        
        $http.put('http://localhost:8080/tuMejorOpcion.web/webresources/ClientMaster/'+DataService.me.id, putData).
        success(function(response) 
        {
            console.log(response);
            
            controller.redirectToCompletedPurchase();
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        })
        
        ;
    };
}]);