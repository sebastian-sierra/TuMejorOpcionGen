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
        
        $http.get('http://localhost:8080/TuMejorOpcion-war/webresources/tiendas').
        success
           (function(data) {
               
            
            DataService.shops = [{name:"Nike", id:0},{name:"Adidas", id:1}]/*data*/;
            DataService.selectedFriend = friend;
            DataService.selectedFriendApplicableShops.push(DataService.shops[0]); //PRUEBAS        
                           
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