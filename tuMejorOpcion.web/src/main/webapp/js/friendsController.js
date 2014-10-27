'use strict';
    
var module = angular.module('friends', ['ngRoute']);

module.controller('FriendsController',['$window','$scope', '$http', 'DataService',function($window, $scope, $http, DataService) 
{        
    $scope.me = DataService.me;
    $scope.friends = DataService.friends;
    $scope.selectedFriend = DataService.selectedFriend;
    
    $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/ClientMaster/'+DataService.me.id).
    success(function(response) 
    {
        console.log(response);

        for (var i in response.listpurchasedGiftCards)
        {
            var controller = self;
            var giftCard = response.listpurchasedGiftCards[i];

            (function(){                  
                var closureGiftCard = giftCard;

                $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/Shop/'+closureGiftCard.shopId).
                success(function(shop) 
                {
                    closureGiftCard.shop = shop;

                    FB.api("/"+closureGiftCard.destinaryId, function (receiver) 
                    {  
                        console.log(receiver);
                        closureGiftCard.receiver = receiver;
                        DataService.purchasedGiftCards.push(closureGiftCard);
                    });
                }); 
            })();
        }        
    });
    
    $scope.redirectToGiftCards = function ()
    {
        console.log("redirecting...");
        $window.location.href = '#/giftCards';
    };
        
    $scope.redirectToPurchasedGiftCards = function ()
    {
        console.log("redirecting...");
        $window.location.href = '#/purchasedGiftCards';
    };
                    
    $scope.didSelectFriend = function(friend)
    {
        console.log(friend.id);
        var controller = self;
        
        $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/Shop/').
        success(function(data) 
        {       
            console.log(data);
    
            DataService.shops = data;
            DataService.selectedFriend = friend;     
                           
            FB.api("/"+ friend.id +"/likes", function (friendLikesResponse) 
            {
                console.log(friendLikesResponse);

                for (var j in friendLikesResponse.data) 
                {   
                    var like = friendLikesResponse.data[j];
                    console.log(like.name);

                    for (var k in DataService.shops)
                    {     
                        var shop = DataService.shops[k];

                        if (like.name.toLowerCase().indexOf(shop.name.toLowerCase()) > -1)
                        {
                            console.log(like.name);
                            DataService.selectedFriendApplicableShops.push(shop);
                            break;
                        }
                    }
                }
                
                $scope.redirectToGiftCards();
            });
        });   
    };
    
}]);