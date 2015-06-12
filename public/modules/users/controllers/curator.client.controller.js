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

angular.module('users').controller('CuratorController', ['$scope', '$http', '$location', 'Authentication','Curators','Hospitals','ExpertGroups','$stateParams',
	function($scope, $http, $location, Authentication,Curators,Hospitals,ExpertGroups,$stateParams) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		//if ($scope.authentication.user) $location.path('/');



		$scope.find = function() {
			$scope.allcurators = Curators.query();
			//console.log($scope.hospitals);
			$scope.findHospitals();
		};


		$scope.addCurator = function() {
			$scope.curator.role='curator';
			$http.post('/addcurator', $scope.curator).success(function(response) {
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
			$location.path('/signupcurator');
			$scope.find();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.searchCurator = function() {
			$http.post('/searchcurator',{searchName:$scope.curator.searchName} ).success(function(response) {
				// If successful we assign the response to the global user model
			//	$scope.authentication.user = response;


			// Clear form fields
			//$scope.curator.searchName = '';

			$scope.searchResult=response;
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

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.addFromList=function(userid){
			console.log(userid);

			$http.post('/addcuratorfromlist', {id:userid}).success(function(response) {
				// If successful we assign the response to the global user model
			//	$scope.authentication.user = response;

				// And redirect to the index page
			$location.path('/signupcurator');
			$scope.find();
			}).error(function(response) {
				$scope.error = response.message;
			});

		}

		$scope.removeCurator=function(userid){
			console.log(userid);

			$http.post('/removecurator', {id:userid}).success(function(response) {
				// If successful we assign the response to the global user model
			//	$scope.authentication.user = response;

				// And redirect to the index page
			$location.path('/signupcurator');
			$scope.find();
			}).error(function(response) {
				$scope.error = response.message;
			});

		}


		$scope.findGroupOne=function(){
				$scope.group = ExpertGroups.get({
				groupId: $stateParams.groupId
			});
		}

		$scope.findGroup=function(){
		//	console.log(userid);

		$scope.allgroups = ExpertGroups.query();
		//console.log($scope.hospitals);
		//$scope.findHospitals();
		}

		$scope.createGroup = function() {

			var expertgroup = new ExpertGroups ({
				title: this.titleName
			});

			// Redirect after save
			expertgroup.$save(function(response) {
				$scope.findGroup();
			//	$location.path('/curatorgroup/' + response._id);

				// Clear form fields
				$scope.titleName = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.viewGroup = function(group) {
			if ( group ) {
				group.$remove();

				for (var i in $scope.allgroups) {
					if ($scope.allgroups [i] === group) {
						$scope.allgroups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$scope.findGroup();
				});
			}
		};

		$scope.removeGroup = function(group) {
			if ( group ) {
				group.$remove();

				for (var i in $scope.allgroups) {
					if ($scope.allgroups [i] === group) {
						$scope.allgroups.splice(i, 1);
					}
				}
			} else {
				$scope.group.$remove(function() {
					$scope.findGroup();
				});
			}
		};
		$scope.searchGroupCurator = function() {
			$http.post('/searchgroupcurator',{searchName:$scope.curator.searchName} ).success(function(response) {
				// If successful we assign the response to the global user model
			//	$scope.authentication.user = response;


			// Clear form fields
			//$scope.curator.searchName = '';

			$scope.searchResult=response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.addMailList=function(group_id,member_id){
			$http.post('/addcuratortogroup',{group_id:group_id,user_id:member_id} ).success(function(response) {

				$scope.findGroupOne();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.removeGroupCurator=function(group_id,member_id){
			$http.post('/removegroupcurator',{group_id:group_id,user_id:member_id} ).success(function(response) {

				$scope.findGroupOne();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};


	}
]);
