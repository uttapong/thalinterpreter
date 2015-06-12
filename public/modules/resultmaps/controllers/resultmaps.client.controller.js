/*
 * Copyright (C) 2015 Thalassemia Interpreter Software
 *
 * This file is part of the Thalassemia Interpreter Software project.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 *
 * Thalassemia Interpreter Software project can not be copied and/or distributed without the express
 * permission of National Science and Technology Development Agency,111 Thailand Science Park (TSP),
 * Phahonyothin Road, Khlong Nueng, Khlong Luang, Pathum Thani 12120, Thailand
 */
'use strict';

// Resultmaps controller
angular.module('resultmaps').controller('ResultmapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Resultmaps',
	function($scope, $stateParams, $location, Authentication, Resultmaps) {
		$scope.authentication = Authentication;

		// Create new Resultmap
		$scope.create = function() {
			// Create new Resultmap object
			var resultmap = new Resultmaps ({
				code: this.code,
				numcode: parseInt(this.numcode),
				results: this.results,
				color: this.color,
				comment: this.comment

			});

			// Redirect after save
			resultmap.$save(function(response) {
				$location.path('resultmaps');

				// Clear form fields
				$scope.name = '';

				$scope.resultmaps = Resultmaps.query();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Resultmap
		$scope.remove = function(resultmap) {
			if ( resultmap ) {
				resultmap.$remove();

				for (var i in $scope.resultmaps) {
					if ($scope.resultmaps [i] === resultmap) {
						$scope.resultmaps.splice(i, 1);
					}
				}
			} else {
				$scope.resultmap.$remove(function() {
					$location.path('resultmaps');
				});
			}
		};

		// Update existing Resultmap
		$scope.update = function() {
			var resultmap = $scope.resultmap;
			//console.log($scope.resultmap);
			resultmap.results=$scope.resultmap.results;

			resultmap.$update(function() {
				$location.path('resultmaps/' + resultmap._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Resultmaps
		$scope.find = function() {
			$scope.resultmaps = Resultmaps.query();
		};

		// Find existing Resultmap
		$scope.findOne = function() {
			$scope.resultmap = Resultmaps.get({
				resultmapId: $stateParams.resultmapId
			});
		};
	}
]);
