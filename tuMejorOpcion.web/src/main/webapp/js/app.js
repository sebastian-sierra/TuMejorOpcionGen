'use strict';

/* App Module */

/*config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);*/

var clienteWebApp = angular.module('phonecatApp', [
  'ngRoute',
  'login',
  'friends',
  'giftCards',
  'completedPurchase',
  'purchasedGiftCards',
  'directive.g+signin'
]);

clienteWebApp.factory('DataService', function () 
{  
    var dataService = {};
    
    dataService.me = null;
    dataService.selectedFriend = null;
    dataService.shops = [];
    dataService.friends = [];
    dataService.selectedFriendApplicableShops = [];
    dataService.purchasedGiftCards = [];
    dataService.facebookOrGoogle = null;
    dataService.myLikes = [];
    
    return dataService;
});

clienteWebApp.config(['$routeProvider', '$httpProvider',
  function($routeProvider, $httpProvider)
  {
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
    //$httpProvider.defaults.headers.common["Accept"] = "application/json";
    //$httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.put["Content-Type"] = "application/json"; 
      
    $routeProvider.
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginController'
      }).
      when('/friends', {
        templateUrl: 'partials/friends.html',
        controller: 'FriendsController'
      }).
      when('/giftCards', {
        templateUrl: 'partials/giftCards.html',
        controller: 'GiftCardsController'
      }).
      when('/purchasedGiftCards', {
        templateUrl: 'partials/purchasedGiftCards.html',
        controller: 'PurchasedGiftCardsController'
      }).
      when('/completedPurchase', {
        templateUrl: 'partials/completedPurchase.html',
        controller: 'CompletedPurchaseController'
      }).
      when('/redeem/:giftCardID', {
        templateUrl: 'partials/redeem.html',
        controller: 'RedeemController'
      }).
      otherwise({
        redirectTo: '/login',
        controller: 'LoginController'
      });
  }]);
  
clienteWebApp.factory("transformRequestAsFormPost", function() 
{
        // I prepare the request data for the form post.
        function transformRequest( data, getHeaders ) {

            var headers = getHeaders();

            headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";

            return( serializeData( data ) );

        }


        // Return the factory value.
        return( transformRequest );


        // ---
        // PRVIATE METHODS.
        // ---


        // I serialize the given Object into a key-value pair string. This
        // method expects an object and will default to the toString() method.
        // --
        // NOTE: This is an atered version of the jQuery.param() method which
        // will serialize a data collection for Form posting.
        // --
        // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
        function serializeData( data ) {

            // If this is not an object, defer to native stringification.
            if ( ! angular.isObject( data ) ) {

                return( ( data === null ) ? "" : data.toString() );

            }

            var buffer = [];

            // Serialize each key in the object.
            for ( var name in data ) {

                if ( ! data.hasOwnProperty( name ) ) {

                    continue;

                }

                var value = data[ name ];

                buffer.push(
                    encodeURIComponent( name ) +
                    "=" +
                    encodeURIComponent( ( value === null ) ? "" : value )
                );

            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer
                .join( "&" )
                .replace( /%20/g, "+" )
            ;

            return( source );

        }

    }
);
