'use strict';

// Suggestions controller
angular.module('suggestions').controller('SuggestionsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Suggestions',
	function($http,$scope, $stateParams, $location, Authentication, Suggestions) {
		$scope.authentication = Authentication;

		// Create new Suggestion
		//$scope.combo={};

		$scope.getcombo=function(){

			$http({method:'GET',url:'/suggestcombo'}).success(function(data){

				$scope.resultmapcombo=data.resultmaps;
				//console.log($scope.resultmap);
				$scope.rbccombo=data.rbcs;
				$scope.resultmap=$scope.resultmapcombo[0];
				$scope.param=$scope.rbccombo[0];
			});
		}
		$scope.create = function() {
			// Create new Suggestion object
			var suggestion = new Suggestions ({
				name: this.name
			});

			// Redirect after save
			suggestion.$save(function(response) {
				$location.path('suggestions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Suggestion
		$scope.remove = function(suggestion) {
			if ( suggestion ) {
				suggestion.$remove();

				for (var i in $scope.suggestions) {
					if ($scope.suggestions [i] === suggestion) {
						$scope.suggestions.splice(i, 1);
					}
				}
			} else {
				$scope.suggestion.$remove(function() {
					$location.path('suggestions');
				});
			}
		};

		// Update existing Suggestion
		$scope.update = function() {
			var suggestion = $scope.suggestion;

			suggestion.$update(function() {
				$location.path('suggestions/' + suggestion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Suggestions
		$scope.find = function() {
			$scope.suggestions = Suggestions.query();
		};

		// Find existing Suggestion
		$scope.findOne = function() {
			$scope.suggestion = Suggestions.get({
				suggestionId: $stateParams.suggestionId
			});
		};
	}
]);
