'use strict';

var module = angular.module('friends', ['ngRoute', 'ngCookies']);

module.controller('FriendsController', ['$window', '$scope', '$http', '$cookies', '$cookieStore', 'DataService', function ($window, $scope, $http, $cookies, $cookieStore, DataService)
    {
        $scope.me = DataService.me;
        $scope.friends = DataService.friends;
        $scope.selectedFriend = DataService.selectedFriend;

        $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/' + DataService.me.id).
                success(function (response)
                {
                    console.log(response);

                    DataService.purchasedGiftCards = [];

                    for (var i in response.listpurchasedGiftCards)
                    {
                        var controller = self;
                        var giftCard = response.listpurchasedGiftCards[i];

                        (function () {
                            var closureGiftCard = giftCard;

                            $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/Shop/' + closureGiftCard.shopId).
                                    success(function (shop)
                                    {
                                        closureGiftCard.shop = shop;

                                        if (DataService.facebookOrGoogle == 'facebook') {
                                            $scope.getGCDestinaryFromFacebook(closureGiftCard);
                                        } else {
                                            $scope.getGCDestinaryFromGoogle(closureGiftCard)
                                        }
                                    });
                        })();


                    }
                });


        $scope.getGCDestinaryFromFacebook = function (giftCard) {

            FB.api("/" + giftCard.destinaryId, function (receiver)
            {
                console.log(receiver);
                giftCard.receiver = receiver;
                DataService.purchasedGiftCards.push(giftCard);
            });

        }

        $scope.getGCDestinaryFromGoogle = function (giftCard) {

            var request = gapi.client.plus.people.get({
                'userId': giftCard.destinaryId
            })

            request.execute(function (response) {

                giftCard.receiver = {
                    id: response.id,
                    name: response.displayName
                }

                DataService.purchasedGiftCards.push(giftCard)

            })

        }

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

        $scope.didSelectFriend = function (friend)
        {
            console.log(friend.id);

            if (DataService.facebookOrGoogle == 'facebook') {
                $scope.selectedFriendFromFacebook(friend)
            } else {
                $scope.selectedFriendFromGoogle(friend)
            }

        };

        $scope.selectedFriendFromGoogle = function (friend) {

            var controller = self;

            DataService.selectedFriend = friend;
            DataService.selectedFriendApplicableShops = [];

            
            $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/likes/'+friend.id).success(function (shops) {

                var possibleLikes = shops;

                for (var j in possibleLikes)
                {
                    var like = possibleLikes[j];
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

        }

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

                $scope.redirectToGiftCards();
            });


        }

    }]);