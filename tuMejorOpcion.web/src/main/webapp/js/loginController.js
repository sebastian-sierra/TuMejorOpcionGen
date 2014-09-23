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
        
        FB.api("/me/friends", function (friendsResponse) 
        {                
            if (friendsResponse && !friendsResponse.error) 
            {
                console.log(friendsResponse);

                for (var i in friendsResponse.data) 
                {           
                    (function() {
                        var index = i;
                        var currentFriend = friendsResponse.data[index]; 
                        
                        FB.api("/"+currentFriend.id+"/picture", function(pictureResponse)
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