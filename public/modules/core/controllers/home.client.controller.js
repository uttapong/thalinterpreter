'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$http',
	function($scope, Authentication,$http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		//$scope.dashboard={};
		$scope.testis='xxx';
		//this.testis='adfdaf';

		$scope.getDashboardInfo = function() {
			$http.get('/dashboard').
		    success(function(data, status, headers, config) {

		      $scope.dashboard = data;
					console.log($scope.dashboard);

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });


		};
	}
]);
