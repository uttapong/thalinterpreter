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
					//	console.log(data.hemotype[i]);


						$scope.doughnut_value.push(data.hemotype[i].count);
						for(var j=0;j<data.resultmaps.length;j++){
							if(data.resultmaps[j]._id==data.hemotype[i]._id)
							$scope.doughnut_label.push(data.resultmaps[j].results[0]);
						}
					}
					//console.log($scope.dashboard);
					$scope.doughnut_options={segmentShowStroke : false};
					console.log($scope.dashboard);

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });


		};
	}
]);
