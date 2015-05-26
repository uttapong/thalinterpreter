'use strict';

angular.module('users').controller('CuratorController', ['$scope', '$http', '$location', 'Authentication','Curators','Hospitals',
	function($scope, $http, $location, Authentication,Curators,Hospitals) {
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
	}
]);
