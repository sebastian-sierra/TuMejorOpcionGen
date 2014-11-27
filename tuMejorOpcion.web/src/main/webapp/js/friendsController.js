'use strict';

var module = angular.module('friends', ['ngRoute', 'ngCookies']);

module.controller('FriendsController', ['$window', '$scope', '$http', '$cookies', '$cookieStore', 'DataService', function ($window, $scope, $http, $cookies, $cookieStore, DataService)
    {
        $scope.me = DataService.me;
        $scope.justPurchased = DataService.justPurchased;
        $scope.selectedFriend = DataService.selectedFriend;

        $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/' + DataService.me.id)
        .success(function(response) {
            console.log(response);
            $scope.clientMaster = response;
                
            DataService.purchasedGiftCards = response.listpurchasedGiftCards;
                
            if(DataService.facebookOrGoogle=="facebook") {
                $scope.facebookFriends = DataService.facebookFriends;
                $scope.googleFriends = response.listgoogleFriends;
            } else {
                $scope.googleFriends = DataService.googleFriends;
                $scope.facebookFriends = response.listfacebookFriends;
            }
        });

        $scope.redirectToGiftCards = function ()
        {
            console.log("redirecting...");
            DataService.justPurchased = false;
            $scope.justPurchased = false;
            $window.location.href = '#/giftCards';
        };

        $scope.redirectToPurchasedGiftCards = function ()
        {
            console.log("redirecting...");
            DataService.justPurchased = false;
            $scope.justPurchased = false;
            $window.location.href = '#/purchasedGiftCards';
        };

        $scope.didSelectFriend = function (friend, from)
        {
            console.log(friend.id);

            if (DataService.facebookOrGoogle == 'facebook') {
                
                if(from=="facebook") {
                    $scope.selectedFriendFromFacebook(friend);
                }
                
                else {
                   $scope.selectedFriendFromGoogle(friend); 
                }
           
           
            } 
            
            else {
                
                if(from=="google") {
                    $scope.selectedFriendFromGoogle(friend);
                }
                
                else {
                    $scope.selectedFriendFromFacebookOnGoogle(friend);
                }
                
            }

        };
        
        $scope.selectedFriendFromFacebookOnGoogle = function(friend) {
            
            DataService.selectedFriend = friend;
            DataService.selectedFriendApplicableShops = [];
            
            $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/'+friend.id).success(function (friendMaster) {

                DataService.selectedFriendApplicableShops = friendMaster.listfacebookLikes;
                
                $scope.redirectToGiftCards();
                
            });
            
        }; 

        $scope.selectedFriendFromGoogle = function (friend) {

            DataService.selectedFriend = friend;
            DataService.selectedFriendApplicableShops = [];

            $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/'+friend.id).success(function (friendMaster) {

                DataService.selectedFriendApplicableShops = friendMaster.listgoogleLikes;
                
                $scope.redirectToGiftCards();
                
            });

        };

        $scope.selectedFriendFromFacebook = function (friend) {

            var controller = self;
            
            DataService.selectedFriend = friend;
            DataService.selectedFriendApplicableShops = [];

            FB.api("/" + friend.id + "/likes", function (friendLikesResponse)
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
                
                $scope.persistLikesFromFacebookFriend(DataService.selectedFriendApplicableShops);

                $scope.redirectToGiftCards();
            });

            
        };
        
        $scope.persistLikesFromFacebookFriend = function(likes) {
            
            var putFriend = {
                friendEntity: {id: DataService.selectedFriend.id},
                updatefacebookLikes: likes
            };
            
            $http.put("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/"+DataService.selectedFriend.id, putFriend)
            .success(function(response) {
                //Hacer lo siguiente
                console.log(response);
                
            });
            
        };

    }]);