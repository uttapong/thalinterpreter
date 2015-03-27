'use strict';


angular.module('core').controller('SystemController', ['$scope', 'Authentication','$http',
	function($scope, Authentication,http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.getinfo=function(){


		http.get('/systeminfo').
		  success(function(data, status, headers, config) {
		    $scope.os=data;
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		}
	}
]);
