/**
 * Donate Application
 */

// Define Function to get Query String Values
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
	'ngRoute',
	'ngSanitize'
]);

/**
 * Configure App Routes
 */
app.config(['$routeProvider',"$locationProvider", function ($routeProvider) {
  	$routeProvider
    	// Home
	    .when("/", {templateUrl: "partials/home.html",controller: "homeController"})
    	// Pages
		.when("/payment", {templateUrl: "partials/payment.html",controller: "paymentController"})
	    .when("/thank-you", {templateUrl: "partials/thankyou.html",controller: "thankyouController"})
	}]);

/*
 * Configure App Controllers
 */

app.controller('homeController', function($scope, $http, srvShareData, $location, srvSaveData, srvSaveTime) {
	$scope.savedData = srvSaveData.getData();
	var savedtime = srvSaveTime.getData();
	var d = new Date();
	var curtime = d.getTime();
	console.log(savedtime);
	var difftime = curtime-savedtime;
	
	if($scope.savedData != '' && $scope.savedData != null && difftime < 3600000){
		window.location.href = "#/thank-you";	
	}

	$scope.submitForm = function(isValid) {
		if (isValid) {
			$scope.isSubmitting=true;
			$http({
			url: 'https://test.oppwa.com:443/v1/checkouts',
			method: 'POST',			
			params: { 'authentication.userId':'8a8294174b7ecb28014b9699220015cc', 'authentication.password':'sy6KJsT8', 'authentication.entityId':'8a8294174b7ecb28014b9699220015ca', 'amount': $scope.amount, 'currency': $scope.currency, 'paymentType':'DB' },
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'} }).success(function(data) { 	
				$scope.isSubmitting=false;	
				//console.log(data.id);
				$scope.shareMyData(data.id);
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
		var currency = document.getElementById('currency').value;
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

app.controller('thankyouController', function($scope, $http, srvShareData, $location, srvSaveData, srvSaveTime,$sce) {
	$scope.savedData = srvSaveData.getData();
	var savedtime = srvSaveTime.getData();
	var d = new Date();
	var curtime = d.getTime();
	console.log(savedtime);
	var difftime = curtime-savedtime;
	
	if($scope.savedData != '' && $scope.savedData != null && difftime < 3600000){
		var savedObj = $scope.savedData;
		var newstring = '<h3>Following are your donation details:</h3>';	
		jQuery.each(savedObj, function(i, val) {
			if(i != 'result' && i != 'card' && i != 'threeDSecure' && i != 'risk'){
				newstring += '<strong>'+i+':</strong> '+val+'<br />';
			}
		});
		document.getElementById('responseData').innerHTML = newstring;
	}else{
		var resourcePath = getUrlParameter('id');
		$http({
			url: 'https://test.oppwa.com:443/v1/checkouts/'+resourcePath+'/payment',
			method: 'GET',			
			params: { 'authentication.userId':'8a8294174b7ecb28014b9699220015cc', 'authentication.password':'sy6KJsT8', 'authentication.entityId':'8a8294174b7ecb28014b9699220015ca'},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'} }).success(function(data) { 	
			$scope.isSubmitting=false;	
			//console.log(data.id);
			console.log(data);
			$scope.responseData = data;	
			var newstring = '<h3>Following are your donation details:</h3>';
			jQuery.each(data, function(i, val) {
				if(i != 'result' && i != 'card' && i != 'threeDSecure' && i != 'risk'){
					newstring += '<strong>'+i+':</strong> '+val+'<br />';
				}
			});
			document.getElementById('responseData').innerHTML = newstring;	
			$scope.shareMyData(data);
			var d = new Date();
			var n = d.getTime();
			console.log(n);
			$scope.saveMyTime(n);
		});	
	}
	
	$scope.dataToShare = [];
					
	$scope.shareMyData = function (myValue) {					
		$scope.dataToShare = myValue;
		srvSaveData.addData($scope.dataToShare);								
	}
	
	$scope.timeToSave = [];
					
	$scope.saveMyTime = function (myValue) {					
		$scope.timeToSave = myValue;
		srvSaveTime.addData($scope.timeToSave);								
	}
		
});

/*
 * Configure App Services
 */
 
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

app.service('srvSaveData', function($window) {
	var KEY = 'App.responseData';

	var addData = function(newObj) {
		var mydata = $window.sessionStorage.getItem(KEY);
		mydata = newObj;
		$window.sessionStorage.setItem(KEY, JSON.stringify(mydata));
	};

	var getData = function(){
		var mydata = $window.sessionStorage.getItem(KEY);
		if (mydata) {
			mydata = JSON.parse(mydata);
		}
		return mydata || [];
	};

	return {
		addData: addData,
		getData: getData
	};
});

app.service('srvSaveTime', function($window) {
	var KEY = 'App.timeStamp';

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
