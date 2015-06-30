'use strict';

// Rbcs controller
angular.module('rbcs').controller('RbcsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rbcs',
	function($scope, $stateParams, $location, Authentication, Rbcs) {
		$scope.authentication = Authentication;

		// Create new Rbc
		$scope.create = function() {
			// Create new Rbc object
			var rbc = new Rbcs ({
				name: this.name,
				label:this.label,
				unit:this.unit,
				min:this.min,
				max:this.max,
				comment:this.comment,
				warning:this.warning
			});

			// Redirect after save
			rbc.$save(function(response) {
				$location.path('rbcs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Rbc
		$scope.remove = function(rbc) {
			if ( rbc ) {
				rbc.$remove();

				for (var i in $scope.rbcs) {
					if ($scope.rbcs [i] === rbc) {
						$scope.rbcs.splice(i, 1);
					}
				}
			} else {
				$scope.rbc.$remove(function() {
					$location.path('rbcs');
				});
			}
		};

		// Update existing Rbc
		$scope.update = function() {
			var rbc = $scope.rbc;

			rbc.$update(function() {
				$location.path('rbcs/' + rbc._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rbcs
		$scope.find = function() {
			$scope.rbcs = Rbcs.query();
		};

		// Find existing Rbc
		$scope.findOne = function() {
			$scope.rbc = Rbcs.get({
				rbcId: $stateParams.rbcId
			});
		};
	}
]);
