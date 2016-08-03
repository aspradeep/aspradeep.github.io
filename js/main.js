/**
 * Donate Application
 */

function getUrlParameter(param, dummyPath) {
        var sPageURL = dummyPath || window.location.search.substring(1),
            sURLVariables = sPageURL.split(/[&||?]/),
            res;

        for (var i = 0; i < sURLVariables.length; i += 1) {
            var paramName = sURLVariables[i],
                sParameterName = (paramName || '').split('=');

            if (sParameterName[0] === param) {
                res = sParameterName[1];
            }
        }

        return res;
}
var app = angular.module('donateWebApp', [
	'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider',"$locationProvider", function ($routeProvider) {
  	$routeProvider
    	// Home
	    .when("/", {templateUrl: "partials/home.html",controller: "homeController"})
    	// Pages
		.when("/payment", {templateUrl: "partials/payment.html",controller: "paymentController"})
	    .when("/thank-you", {templateUrl: "partials/thankyou.html",controller: "thankyouController"})
	}]);


app.controller('homeController', function($scope, $http, srvShareData, $location) {

	$scope.submitForm = function(isValid) {
		if (isValid) {
			$scope.isSubmitting=true;
			$http({
			url: 'http://kavisoftek.in/dev/checkout.php',
			method: 'POST',
			params: {  amount: $scope.amount, currency: $scope.currency },
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'} }).success(function(data) { 	
				$scope.isSubmitting=false;	
				console.log(data);
				if ( ! data.success) {				
					if (data.errors.currency) {
						$('#currency-group').addClass('has-error');
						$('#currency-group .help-block').html(data.errors.currency);
					}
					
					if (data.errors.amount) {
						$('#amount-group').addClass('has-error');
						$('#amount-group .help-block').html(data.errors.amount);
					}
				
				} else {
					$scope.shareMyData(data.responseData);
				}
			});
	   }

	};
	$scope.dataToShare = [];
					
	$scope.shareMyData = function (myValue) {					
		$scope.dataToShare = myValue;
		srvShareData.addData($scope.dataToShare);	
		window.location.href = "#/payment";								
	}
	$scope.changeCurrency = function(){
		let currency = document.getElementById('currency').value;
		if(currency != ''){
		  document.getElementById('currhold').innerHTML = currency;
		}
	};

});

app.controller('paymentController', function($scope, srvShareData) {
  	$scope.sharedData = srvShareData.getData();
	$scope.srcLink = 'https://test.oppwa.com/v1/paymentWidgets.js?checkoutId='+$scope.sharedData ;
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src = $scope.srcLink;
	s.innerHTML = null;
	s.id = "paymentSrc";
	document.getElementById("paymentForm").innerHTML = "";
	document.getElementById("paymentForm").appendChild(s);
});

app.controller('thankyouController', function($scope, $http, srvShareData, $location) {
	let resourcePath = getUrlParameter('id');
	$http({
		url: 'process.php',
		method: 'POST',
		params: {  resourcePath: $scope.resourcePath },
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).success(function(data) { 	
		console.log(data);
		if ( ! data.success) {				
			if (data.errors.currency) {
				$('#currency-group').addClass('has-error');
				$('#currency-group .help-block').html(data.errors.currency);
			}
			
			if (data.errors.amount) {
				$('#amount-group').addClass('has-error');
				$('#amount-group .help-block').html(data.errors.amount);
			}
		
		} else {
			$scope.responseData = data.responseData;
		}
	});
});

app.service('srvShareData', function($window) {
        var KEY = 'App.SelectedValue';

        var addData = function(newObj) {
            var mydata = $window.sessionStorage.getItem(KEY);
            mydata = newObj;
            $window.sessionStorage.setItem(KEY, mydata);
        };

        var getData = function(){
            var mydata = $window.sessionStorage.getItem(KEY);
            return mydata;
        };

        return {
            addData: addData,
            getData: getData
        };
    });
