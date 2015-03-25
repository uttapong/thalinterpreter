'use strict';

// Typings controller
angular.module('typings').controller('TypingsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Typings','ResultMap',
	function($http,$scope, $stateParams, $location, Authentication, Typings,ResultMap) {
		$scope.authentication = Authentication;

		// Create new Typing
		$scope.create = function() {
			// Create new Typing object
			var typing = new Typings ({
				typingid: this.typingid,
				gender: this.gender,
				age: this.age,
				dcip: this.dcip,
				hb:this.hb,
				mcv:this.mcv,
				a:this.a,
				a2:this.a2,
				hbe:this.hbe,
				hbcs:this.hbcs,
				bart_h:this.bart_h
			});

			$scope.gender= ['Male','Female'];

			// Redirect after save
			typing.$save(function(response) {
				$location.path('typings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


		};

		// Remove existing Typing
		$scope.remove = function(typing) {
			if ( typing ) { 
				typing.$remove();

				for (var i in $scope.typings) {
					if ($scope.typings [i] === typing) {
						$scope.typings.splice(i, 1);
					}
				}
			} else {
				$scope.typing.$remove(function() {
					$location.path('typings');
				});
			}
		};

		// Update existing Typing
		$scope.update = function() {
			var typing = $scope.typing;

			typing.$update(function() {
				$location.path('typings/' + typing._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Typings
		$scope.find = function() {
			$scope.typings = Typings.query();
		};

		// Find existing Typing
		$scope.findOne = function() {
			$scope.typing = Typings.get({ 
				typingId: $stateParams.typingId
			});
		};
		$scope.getResultMap=function(){
			$scope.resultmaps=ResultMap.query();
		};
		$scope.livecheck=function(){
			$http.post('/typings/live',{dcip:$scope.dcip,hb:$scope.hb,mcv:$scope.mcv,a:$scope.a,a2:$scope.a2,hbe:$scope.hbe,hbcs:$scope.hbcs,bart_h:$scope.bart_h}).
		    success(function(data, status, headers, config) {
		      $scope.typingdata = data;
		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });
		};
		$scope.typingcheck=function(code){
			if(!$scope.typingdata)return 0;
			return $scope.typingdata[code];
		};
	}
]);