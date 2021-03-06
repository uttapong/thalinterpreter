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

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','Hospitals',
	function($scope, $http, $location, Authentication,Hospitals) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/dashboard');

		$scope.signup = function() {
			$scope.credentials.hospital=$scope.hospital._id;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/dashboard');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.addcurator = function() {
			$scope.curator.role='curator';
			$http.post('/auth/addcurator', $scope.curator).success(function(response) {
				// If successful we assign the response to the global user model
			//	$scope.authentication.user = response;
			$location.path('addcurator/');

			// Clear form fields
			$scope.curator.firstName = '';
			$scope.curator.lastName = '';
			$scope.curator.email = '';
			$scope.curator.username = '';
			$scope.curator.password = '';

				// And redirect to the index page
			//	$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};


		$scope.findHospitals = function() {
			 Hospitals.query(function(data){
				$scope.hospitals =data;
				$scope.hospital=$scope.hospitals[0];
			});

			//console.log($scope.hospitals);

		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				$scope.authentication.user.admin= $scope.authentication.user.roles.indexOf('admin')>=0?true:false;//IsAdmin();
				console.log($scope.authentication.user);
				// And redirect to the index page
				$location.path('/dashboard');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
