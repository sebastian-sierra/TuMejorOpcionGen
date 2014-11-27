'use strict';
    
var module = angular.module('giftCards', ['ngRoute']);

module.controller('GiftCardsController',['DataService','$window','$scope', '$http', function(DataService, $window, $scope, $http) 
{    
    $scope.selectedGiftCard = null;     
    $scope.giftCards = [];
    $scope.selectedFriend = DataService.selectedFriend;
    $scope.formData = {};
    
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
        $window.location.href = '#/friends';
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
                value:$scope.formData.value,
                shopId: giftCard.shop.name,
                dateCreated: new Date().getDate()+"/"+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),
                destinaryId: DataService.selectedFriend.name,
                redimido: false
            }
        };
        
        $http.put('https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/'+DataService.me.id, putData).
        success(function(response) 
        {
            console.log(response);
            
            DataService.justPurchased = true;
            controller.redirectToCompletedPurchase();
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        })
        
        ;
    };
}]);