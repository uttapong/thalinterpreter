'use strict';

// Typings controller
angular.module('typings').controller('TypingsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'AllTypings','PageTypings','ResultMap',
	function($http,$scope, $stateParams, $location, Authentication, Typings,PageTypings,ResultMap) {
		$scope.authentication = Authentication;
		$scope.genderchoice = [{
			  id: 'Male',
			  label: 'Male',
			  subItem: { name: 'Male' }
			}, {
			  id: 'Female',
			  label: 'Female',
			  subItem: { name: 'Female' }
			}];
		$scope.gender=$scope.genderchoice[0];


		//pagination setting
		$scope.totalItems = 0;
	  $scope.currentPage = 1;
		$scope.perPage=50;
		$scope.numPages=0;

		$scope.typingdata={};
	  $scope.setPage = function (pageNo) {

			PageTypings.getResults(pageNo,$scope.perPage).success(function(data,status,header,config){
				console.log(data);
				$scope.typingslist=data.typings;
				$scope.totalItems=data.count;
				$scope.currentPage = pageNo;
				//$scope.numPages=Math.ceil($scope.totalItems/$scope.perPage);
				//console.log($scope.numPages);
			});

	  };

	  $scope.pageChanged = function() {
	    $log.log('Page changed to: ' + $scope.currentPage);
	  };

	  $scope.maxSize =10;


		// Create new Typing
		$scope.create = function() {
			// Create new Typing object
			var typing = new Typings ({
				typingid: this.typingid,
				gender: this.gender.id,
				age: this.age,
				typing: this.typingdata
			/*	dcip: this.dcip,
				hb:this.hb,
				mcv:this.mcv,
				a:this.a,
				a2:this.a2,
				hbe:this.hbe,
				hbcs:this.hbcs,
				bart_h:this.bart_h*/
			});




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
		PageTypings.getResults($scope.currentPage,$scope.perPage).success(function(data,status,header,config){
			console.log(data);
			$scope.typingslist=data.typings;
			$scope.totalItems=data.count;
			//$scope.numPages=Math.ceil($scope.totalItems/$scope.perPage);
			//console.log($scope.numPages);
		});


		};

		// Find existing Typing
		$scope.findOne = function() {
			$scope.typing = Typings.get({
				typingId: $stateParams.typingId
			});
		};
		$scope.getResultMap=function(){
			$scope.resultmaps=ResultMap.query();
			$scope.getRBC();
		};
		$scope.getRBC=function(){
			$scope.rbcs=$http.get('/rbcs').
		  success(function(data, status, headers, config) {
				$scope.rbcs=data;
			/*	for(i=0;i<data.length;i++){
					$scope.typingdata.push(data[i].name);
				}*/

				console.log(data);
		  }).
		  error(function(data, status, headers, config) {
				console.log('error get rbcs');
		  });
		}
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

		$scope.callPage = function callServer(tableState) {

	    ctrl.isLoading = true;

	    var pagination = tableState.pagination;

	    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
	    var number = pagination.number || 10;  // Number of entries showed per page.

	    service.getPage(start, number, tableState).then(function (result) {
	      ctrl.displayed = result.data;
	      tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
	      ctrl.isLoading = false;
	    });
	  };
	}
]);
