'use strict';

var module = angular.module('login', ['ngRoute', 'ngCookies']);

module.controller('LoginController', ['$scope', '$window', '$location', 'DataService', '$http', '$cookies', '$cookieStore', 'transformRequestAsFormPost', function ($scope, $window, $location, DataService, $http, $cookies, $cookieStore, transformRequestAsFormPost)
    {
        $scope.n = "Controller";
        DataService.me = $cookieStore.get('me');
        $scope.me = DataService.me;
        $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/Shop/').success(function(response) {
            DataService.shops = response;
        });

        $scope.redirectToFriends = function ()
        {
            console.log('redirecting...');
            $window.location.href = '#/friends';
        };

        window.fbAsyncInit = function ()
        {
            
            FB.Event.subscribe('auth.authResponseChange', function (response)
            {
                $scope.checkLoginState();
            });
        };

        $scope.checkLoginState = function ()
        {
            var controller = this;

            FB.getLoginStatus(function (data)
            {
                console.log(data);
                DataService.facebookOrGoogle='facebook';
                $scope.getUserFriendsAndLikes();
            });
        };

        $scope.getUserFriendsAndLikes = function ()
        {
            var controller = this;

            DataService.friends = [];

            FB.api("/me/friends", function (friendsResponse)
            {
                if (friendsResponse && !friendsResponse.error)
                {
                    console.log(friendsResponse);

                    for (var i in friendsResponse.data)
                    {
                        (function () {
                            var index = i;
                            var currentFriend = friendsResponse.data[index];

                            FB.api("/" + currentFriend.id + "/picture", function (pictureResponse)
                            {
                                currentFriend.url = pictureResponse.data.url;
                                DataService.friends.push(currentFriend);
                                console.log(currentFriend);
                            });
                        })();
                    }

                    FB.api("/me", function (me)
                    {
                        console.log(me);

                        $cookieStore.put('me', me);
                        DataService.me = me;
                        var postData =
                                {
                                    id: me.id,
                                    name: me.first_name,
                                    email: me.email
                                };

                        var request = $http({
                            method: "post",
                            url: "https://localhost:8181/tuMejorOpcion.web/webresources/Client/",
                            //transformRequest: transformRequestAsFormPost,
                            data: postData
                        });

                        // Store the data-dump of the FORM scope.
                        request.success(function (response)
                        {
                            console.log(response);
                        });

                        $cookieStore.put('friends', DataService.friends);
                        controller.redirectToFriends();
                    });
                }
            });
        };

        //Google Plus
        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            // User successfully authorized the G+ App!

            console.log(gapi.auth.getToken())
            console.log('Signed in!');
            
            DataService.facebookOrGoogle = 'google';

            gapi.client.load('plus', 'v1', function() {

                var request = gapi.client.plus.people.get({
                    'userId':'me'
                })

                request.execute(function(response) {

                    DataService.me = {
                        id: response.id,
                        first_name: response.displayName,
                        email: response.emails[0].value
                    }

                    //Guardar en Back-end al usuario

                    var postData =
                    {
                        id: DataService.me.id,
                        name: DataService.me.first_name,
                        email: DataService.me.email
                        
                    };

                    request = $http({
                        method: "post",
                        url: "https://localhost:8181/tuMejorOpcion.web/webresources/Client/",
                        //transformRequest: transformRequestAsFormPost,
                        data: postData
                    });

                    request.success(function (response)
                    {
                        console.log(response);
                    });

                    $scope.requestFriendsGooglePlus()

                })


            });

        });

        $scope.requestFriendsGooglePlus = function() {

            var request = gapi.client.plus.people.list({
                'userId': 'me',
                'collection': 'visible' //Cambiar a connected
            });

            request.execute(function(response) {
                $scope.getFriendsGooglePlus(response)
            });

        }

        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            // User has not authorized the G+ App!
            console.log('Not signed into Google Plus.');
        });

        $scope.getFriendsGooglePlus = function(friends)
        {
            DataService.friends = [];
            DataService.myLikes = [];

            for(var i in friends.items)
            {
                if(friends.items[i].objectType=='person') {
                    var newFriend =
                    {
                        id: friends.items[i].id,
                        name: friends.items[i].displayName,
                        url: friends.items[i].image.url
                    };

                    DataService.friends.push(newFriend)
                }
                else {
                    
                    for(var j in DataService.shops)
                    {
                        if(friends.items[i].displayName.toLowerCase().indexOf(DataService.shops[j].name.toLowerCase()) > -1) {
                            DataService.myLikes.push(DataService.shops[j]);
                        }
                    }
                    
                }

            }

            $scope.persistLikes()

        }
        
        $scope.persistLikes = function() {
            
            var putData = 
            {
                clientEntity :
                {
                    id : DataService.me.id
                },
                
                createshops : DataService.myLikes
            }
            
            $http.put('https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/'+DataService.me.id, putData).
            success(function(response) 
            {
                console.log(response);
                $scope.redirectToFriends();
            }).
            error(function(data, status, headers, config) {
                console.log(data);
                $scope.redirectToFriends();
            })
            
            
        } 
        
    }]);