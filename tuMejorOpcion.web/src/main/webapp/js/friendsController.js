'use strict';
    
var module = angular.module('friends', ['ngRoute']);

module.controller('FriendsController',['$window','$scope', '$http', 'DataService',function($window, $scope, $http, DataService) 
{        
    $scope.me = DataService.me;
    $scope.friends = DataService.friends;
    
    $scope.redirectToGiftCards = function ()
    {
        console.log("redirecting...");
        $window.location.href = '#/giftCards';
    };
                    
    $scope.didSelectFriend = function(friend)
    {
        console.log(friend.id);
        var controller = self;
        
        $http.get('http://localhost:8080/tuMejorOpcion.web/webresources/Shop/').
        success
           (function(data) {
               
           
            DataService.shops = data/*data*/;
            DataService.selectedFriend = friend;     
                           
            FB.api("/"+ friend.id +"/likes", function (friendLikesResponse) 
            {
                console.log(friendLikesResponse);

                for (var j in friendLikesResponse.data) 
                {   
                    var like = friendLikesResponse.data[j];
                    
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