'use strict';

var module = angular.module('login', ['ngRoute', 'ngCookies']);

module.controller('LoginController', ['$scope', '$window', '$location', 'DataService', '$http', '$cookies', '$cookieStore', 'transformRequestAsFormPost', function ($scope, $window, $location, DataService, $http, $cookies, $cookieStore, transformRequestAsFormPost)
    {
        $scope.n = "Controller";
        $scope.me = DataService.me;
        $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/Shop/').success(function (response) {
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
                DataService.facebookOrGoogle = 'facebook';
                $scope.getUserInfoFromFacebook();
            });
        };

        $scope.getUserInfoFromFacebook = function ()
        {
            var controller = this;

            FB.api("/me", function (me)
            {
                console.log(me);

                $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/Client/' + me.email)
                .success(function (clientResponse) {

                    //Ya existe otro cliente con el mismo email
                    //Revisar si ya tiene id de Facebook
                    
                    if(clientResponse!="") {

                        var client = clientResponse;
                   
                        if (client.idFacebook == null) {
                            client.idFacebook = me.id;
                            //Coge los likes del usuario al haber finalizado
                            DataService.me = client;
                            $scope.updateClientInBackend(client);
                        }
                        else {
                            DataService.me = client;
                            //Buscar likes
                            $scope.getUserLikesFromFacebook();
                        }
                    
                    }

                    
                    else {

                        //No hay otro cliente con el mismo email

                        var client = {
                            id: me.email,
                            name: me.name,
                            email: me.email,
                            idFacebook: me.id
                        };
                    
                        DataService.me = client;
                        //Coge los likes del usuario al haber finalizado
                        $scope.registerClientInBackEnd(client);
                        //controller.redirectToFriends();
                    
                    }

                });

            });

        };
        
        $scope.updateClientInBackend = function(client) {
                      
            $http.put("https://localhost:8181/tuMejorOpcion.web/webresources/Client/"+client.id, client)
            .success(function (response) {
                console.log(response);
                
                if(DataService.facebookOrGoogle=='facebook') {
                    $scope.getUserLikesFromFacebook();
                }
                else {
                    $scope.getUserLikesFromGoogle();
                }
            
            });
            
        };
        
        //Google Plus
        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            // User successfully authorized the G+ App!

            console.log(gapi.auth.getToken());
            console.log('Signed in!');

            DataService.facebookOrGoogle = 'google';

            gapi.client.load('plus', 'v1', function () {

                var request = gapi.client.plus.people.get({
                    'userId': 'me'
                });

                request.execute(function (me) {

                    $http.get('https://localhost:8181/tuMejorOpcion.web/webresources/Client/' + me.emails[0].value)
                    .success(function (clientResponse) {

                        //Revisar si ya existe otro cliente con el mismo email
                        
                        if(clientResponse!="") {
                            
                            var client = clientResponse;
                            //Revisa si ya tiene id de google
                            if (client.idGoogle == null) {
                                client.idGoogle = me.id;
                                //Coge los likes del usuario al haber finalizado
                                DataService.me = client;
                                $scope.updateClientInBackend(client);
                            }
                            else {
                                DataService.me = client;
                                //Buscar likes
                                $scope.getUserLikesFromGoogle();
                            }
                    
                        }
 
                    else {

                        //No hay otro cliente con el mismo email
                        var client = {
                            id: me.emails[0].value,
                            name: me.displayName,
                            email: me.emails[0].value,
                            idGoogle: me.id
                        };
                    
                        DataService.me = client;
                        //Coge los likes del usuario al haber finalizado
                        $scope.registerClientInBackEnd(client);
                        //controller.redirectToFriends();
                    
                    }

                });

                });

            });

        });

        $scope.registerClientInBackEnd = function (clientData) {

            var request = $http({
                method: "post",
                url: "https://localhost:8181/tuMejorOpcion.web/webresources/Client/",
                //transformRequest: transformRequestAsFormPost,
                data: clientData
            });

            request.success(function (response) {
                console.log(response);
                
                if(DataService.facebookOrGoogle=='facebook') {
                    $scope.getUserLikesFromFacebook();
                }
                else {
                    $scope.getUserLikesFromGoogle();
                }
                
            });
        };

        $scope.requestFriendsGooglePlus = function () {

            var request = gapi.client.plus.people.list({
                'userId': 'me',
                'collection': 'visible' //Cambiar a connected
            });

            request.execute(function (response) {
                $scope.getFriendsGooglePlus(response)
            });

        }

        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            // User has not authorized the G+ App!
            console.log('Not signed into Google Plus.');
        });

        $scope.getFriendsGooglePlus = function (friends)
        {
            DataService.friends = [];
            DataService.myLikes = [];

            for (var i in friends.items)
            {
                if (friends.items[i].objectType == 'person') {
                    var newFriend =
                            {
                                id: friends.items[i].id,
                                name: friends.items[i].displayName,
                                url: friends.items[i].image.url
                            };

                    DataService.friends.push(newFriend)
                }
                else {

                    for (var j in DataService.shops)
                    {
                        if (friends.items[i].displayName.toLowerCase().indexOf(DataService.shops[j].name.toLowerCase()) > -1) {
                            DataService.myLikes.push(DataService.shops[j]);
                        }
                    }

                }

            }

            $scope.persistLikes()

        };
        
        

        $scope.persistLikes = function (friendLikes) {

           if(DataService.facebookOrGoogle=="facebook") {
               
               $http.get("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/"+DataService.me.idFacebook)
               .success(function(friend) {
                    
                    if(friend.friendEntity!=null) {
                        friend.updatefacebookLikes = friendLikes;
                    
                        $http.put("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/"+DataService.me.idFacebook, friend)
                        .success(function(response) {
                            //Hacer lo siguiente
                            console.log(response);
                            $scope.getUserFriendsFromFacebook();
                        });
                    
                    }
                    
                    else {
                        var friend = {
                            friendEntity : {id:DataService.me.idFacebook, imgUrl: "",name: DataService.me.name},
                            updatefacebookLikes : friendLikes
                        };
                    
                        $http.post("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster",friend)
                        .success(function(response) {
                            console.log(response);
                            $scope.getUserFriendsFromFacebook();
                        });
                    }
                });
                      
           }
           
           else {
               
               $http.get("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/"+DataService.me.idGoogle)
               .success(function(friend) {
                    
                    if(friend.friendEntity!=null) {
                        friend.updategoogleLikes = friendLikes;
                    
                        $http.put("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster/"+DataService.me.idGoogle, friend)
                        .success(function(response) {
                            //Hacer lo siguiente
                            console.log(response);
                            $scope.getUserFriendsFromGoogle();
                        });
                    
                    }
                    
                    else {
                        var friend = {
                            friendEntity : {id:DataService.me.idGoogle, imgUrl: "",name: DataService.me.name},
                            updategoogleLikes : friendLikes
                        };
                    
                        $http.post("https://localhost:8181/tuMejorOpcion.web/webresources/FriendMaster",friend)
                        .success(function(response) {
                            console.log(response);
                            $scope.getUserFriendsFromGoogle();
                        });
                    }
                });
           }

        };
        
        $scope.getUserLikesFromFacebook = function() {
            
            FB.api("/me/likes", function(likes) {
                
                var friendLikes = [];
                
                for(var i in likes.data) {
                    
                    var currentLike = likes.data[i];
                    
                    for(var j in DataService.shops) {
                        
                        var currentShop = DataService.shops[j];
                        
                        if(currentLike.name.toLowerCase().indexOf(currentShop.name.toLowerCase()) > -1) {
                            friendLikes.push(currentShop);
                        }
                        
                    }
                    
                }
                
                $scope.persistLikes(friendLikes);
                
            });
            
        };
        
        $scope.getUserLikesFromGoogle = function() {
            
            var request = gapi.client.plus.people.list({
                'userId': 'me',
                'collection': 'visible' //Cambiar a connected
            });
            
            request.execute(function (likes) {
                
                var userLikes = [];
                
                for(var i in likes.items) {
                    
                    var currentLike = likes.items[i];
                    
                    for(var j in DataService.shops) {
                        
                        var currentShop = DataService.shops[j];
                        
                        if(currentLike.objectType =="page" && currentLike.displayName.toLowerCase().indexOf(currentShop.name.toLowerCase()) > -1) {
                            userLikes.push(currentShop);
                        }
                        
                    }
                    
                }
                
                $scope.persistLikes(userLikes);
                
            });
            
        };
        
        $scope.getUserFriendsFromFacebook = function() {
            
            FB.api("/me/friends", function (friendsResponse)
            {
                DataService.facebookFriends = [];
                
                if (friendsResponse && !friendsResponse.error)
                {
                    console.log(friendsResponse);

                    for (var i in friendsResponse.data)
                    {
                        (function () {
                            var index = i;
                            
                            var currentFriend = {
                                id: friendsResponse.data[i].id,
                                name : friendsResponse.data[i].name
                            };

                            FB.api("/" + currentFriend.id + "/picture", function (pictureResponse)
                            {
                                currentFriend.imgUrl = pictureResponse.data.url;
                                DataService.facebookFriends.push(currentFriend);
                                console.log(currentFriend);
                                
                                if(friendsResponse.data.length == DataService.facebookFriends.length) {
                                    console.log("termino");
                                    $scope.persistFriends();
                                }
                            });
                            
                        })();
                    }
                }
            });
            
        };
        
        $scope.getUserFriendsFromGoogle = function() {
            
            var request = gapi.client.plus.people.list({
                'userId': 'me',
                'collection': 'connected'
            });
            
            request.execute(function (friends) {
                
                DataService.googleFriends = [];
                
                for(var i in friends.items) {
                    
                    var currentFriend = {
                        id: friends.items[i].id,
                        name: friends.items[i].displayName,
                        imgUrl: friends.items[i].image.url
                    };
                    
                    DataService.googleFriends.push(currentFriend);
                    
                }
                
                $scope.persistFriends();
                
            });
            
        };
        
        $scope.persistFriends = function() {
            
            if(DataService.facebookOrGoogle=="facebook") {
                
                var putClientMaster = {
                    clientEntity: {id: DataService.me.id},
                    updatefacebookFriends: DataService.facebookFriends
                };
                
                $http.put("https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/"+DataService.me.id, putClientMaster)
                .success( function(response) {
                    console.log(response);
                    $scope.redirectToFriends();
                });
                
            }
            
            else {
                
                var putClientMaster = {
                    clientEntity: {id: DataService.me.id},
                    updategoogleFriends: DataService.googleFriends
                };
                
                $http.put("https://localhost:8181/tuMejorOpcion.web/webresources/ClientMaster/"+DataService.me.id, putClientMaster)
                .success( function(response) {
                    console.log(response);
                    $scope.redirectToFriends();
                });
            }
            
        };

    }]);