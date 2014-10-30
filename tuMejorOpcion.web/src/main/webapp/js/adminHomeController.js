var module = angular.module('adminHomeController', ['ngRoute']);

module.controller('AdminHomeController',['$scope','$window','$location','DataService', '$http',function($scope,$window, $location, DataService, $http)
{
    $scope.n = "Controller";
    $scope.giftCardID;
    $scope.validGiftCard=DataService.validGiftCard;
    $scope.invalid=false;
    $scope.redeemed=false;

    $scope.validateGiftCard = function()
    {
        var controller = this;
        var url = $location.protocol()+"://"+$location.host()+":"+$location.port();
        $http.get(url+'/tuMejorOpcion.web/webresources/GiftCard/'+$scope.giftCardID).
        success(function(response)
        {
            console.log(response);
            if(response=="")
            {
                $scope.invalid=true;
            }
            else
            {
                $scope.validGiftCard = response;
                controller.redirectToValid();
            }
        }).
        error(function(data, status, headers, config) {

        })

        /*$scope.validGiftCard = {
            id:1,
            value:2000,
            shopId:1,
            dateCreated: new Date().getDay()+"/"+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),
            destinaryId: 1020,
            estado: "Sin redimir"
        };

        controller.redirectToValid();
        $scope.invalid=true;*/
        console.log($location.protocol()+"://"+$location.host()+":"+$location.port());


    }

    $scope.redirectToInvalid= function()
    {
        console.log("invalid");
    }

    $scope.redirectToValid = function()
    {
        DataService.validGiftCard = $scope.validGiftCard;
        $window.location.href = '#/validGiftCard';
    }

    $scope.redeemGiftCard = function()
    {
        var controller = this;
        
        console.log("To redeem: "+DataService.validGiftCard.id)
        
        DataService.validGiftCard.redimido=true;

        var putData = DataService.validGiftCard
        
        $http.put('https://localhost:8181/tuMejorOpcion.web/webresources/GiftCard/'+DataService.validGiftCard.id, putData).
        success(function(response) 
        {   
            DataService.validGiftCard = response;
            $scope.redeemed = true;
        }).
        error(function(data, status, headers, config) {
            console.log(data);
        });
        
        
        
    }
    

}]);