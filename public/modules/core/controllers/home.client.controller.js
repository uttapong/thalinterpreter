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
					$scope.doughnut_label=[];
					$scope.doughnut_value=[];
		      $scope.dashboard = data;
					for(var i=0;i<data.hemotype.length;i++){
						$scope.doughnut_label.push(data.hemotype._id);
						$scope.doughnut_value.push(data.hemotype.count);
					}
					console.log($scope.dashboard);

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });


		};
	}
]);
