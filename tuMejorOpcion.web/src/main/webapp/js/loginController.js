'use strict';
    
var module = angular.module('login', ['ngRoute']);

module.controller('LoginController',['$scope','$window','$location','DataService', '$http', 'transformRequestAsFormPost',function($scope,$window, $location, DataService, $http, transformRequestAsFormPost)
{    
    $scope.n = "Controller";
    
    $scope.redirectToFriends = function ()
    {
        console.log('redirecting...');
        $window.location.href = '#/friends';
    };
                    
    window.fbAsyncInit = function() 
    {    
        FB.Event.subscribe('auth.authResponseChange', function(response)
        {  
            $scope.checkLoginState();
        });
    };
      
    $scope.checkLoginState = function() 
    {
        var controller = this;

        FB.getLoginStatus(function(data)
        {
           console.log(data);

           $scope.getUserFriendsAndLikes();		
        });
    };
    
    $scope.getUserFriendsAndLikes = function()
    {
        var controller = this;
        
        function Friend(name, id, url)
        {
            this.name = name;
            this.id = id;
            this.url = url
        }
        
        FB.api("/me/friends", function (friendsResponse) 
        {                
            if (friendsResponse && !friendsResponse.error) 
            {
                console.log(friendsResponse);

                for (var i in friendsResponse.data) 
                {
                    var friend = friendsResponse.data[i]; 
                    console.log(friend.name);
                    
                    FB.api("/"+friend.id+"/picture", function(pictureResponse)
                    {
                      var picture = pictureResponse.data.url;
                      DataService.friends.push(new Friend(friend.name, friend.id, picture));
                      console.log(DataService.friends);
                    });

                    
                }
                
                FB.api("/me", function (me) 
                {
                    console.log(me);
                    
                    DataService.me = me;
                    var postData = 
                    {
                        id: me.id,
                        name: me.first_name,
                        email: me.email
                    };
                    
                    var request = $http({
                        method: "post",
                        url: "http://localhost:8080/tuMejorOpcion.web/webresources/Client/",
                        //transformRequest: transformRequestAsFormPost,
                        data: postData
                    });
                    
                    // Store the data-dump of the FORM scope.
                    request.success(function(response) 
                    {
                        console.log(response);
                    });
                    
                    controller.redirectToFriends();
                });              
            }
        });
    };
    
}]);