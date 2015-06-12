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

// Hospitals controller
angular.module('hospitals').controller('HospitalsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hospitals',
	function($scope, $stateParams, $location, Authentication, Hospitals) {
		$scope.authentication = Authentication;

		// Create new Hospital
		$scope.create = function() {
			// Create new Hospital object
			var hospital = new Hospitals ({
				name: this.name,
				address: this.address,
				contact_number: this.contact_number,
				contact_person: this.contact_person,
				location: this.location
			});

			// Redirect after save
			hospital.$save(function(response) {
				$location.path('hospitals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hospital
		$scope.remove = function(hospital) {
			if ( hospital ) { 
				hospital.$remove();

				for (var i in $scope.hospitals) {
					if ($scope.hospitals [i] === hospital) {
						$scope.hospitals.splice(i, 1);
					}
				}
			} else {
				$scope.hospital.$remove(function() {
					$location.path('hospitals');
				});
			}
		};

		// Update existing Hospital
		$scope.update = function() {
			var hospital = $scope.hospital;

			hospital.$update(function() {
				$location.path('hospitals/' + hospital._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hospitals
		$scope.find = function() {
			$scope.hospitals = Hospitals.query();
			//console.log($scope.hospitals);
			
		};

		// Find existing Hospital
		$scope.findOne = function() {
			$scope.hospital = Hospitals.get({ 
				hospitalId: $stateParams.hospitalId
			});
		};
	}
]);