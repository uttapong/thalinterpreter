'use strict';

// Typings controller
angular.module('typings').controller('TypingsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'AllTypings','PageTypings','ResultMap','Uploads', '$upload','SweetAlert','$sce',
	function($http,$scope, $stateParams, $location, Authentication, Typings,PageTypings,ResultMap,Upload, $upload,sweet,$sce) {
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
		$scope.devicechoice = [{
				  id: 'Male',
				  label: 'Male',
				  subItem: { name: 'Male' }
				}, {
				  id: 'Female',
				  label: 'Female',
				  subItem: { name: 'Female' }
				}];
		$scope.gender=$scope.genderchoice[0];
		$scope.device=$scope.devicechoice[0];


		//pagination setting
		$scope.totalItems = 0;
	  $scope.currentPage = 1;
		$scope.perPage=50;
		$scope.numPages=0;

		$scope.selectedFile = [];
		$scope.uploadProgress = 0;

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
	    console.log('Page changed to: ' + $scope.currentPage);
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
			console.log(typing);
			typing.$update(function() {
				$location.path('typings/' + typing.typing._id);
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
			Typings.get({
				typingId: $stateParams.typingId
			},function(typing){
				$scope.typing = typing;
				$scope.livecheck();
				//console.log($scope.typing);
			});

			$scope.getRBC();

			$scope.printurl = $sce.trustAsResourceUrl('/printview/'+$stateParams.typingId);

		/*	$http.get('/printview/'+$stateParams.typingId).
  success(function(data, status, headers, config) {
		$scope.printhtml_trusted = $sce.trustAsHtml(data);
  }).error(function(data, status, headers, config) {});*/

		};

		$scope.typingReport = function() {
			/*scope.typing = Typings.get({
				typingId: $stateParams.typingId
			});*/
			$http({url:'/typingreport/'+$stateParams.typingId}).success(function(data){
				$scope.typing=data.typing;
				$scope.suggestions=[];
				$scope.warnings=[];
				angular.forEach(data.suggestion,function(value,key){
					$scope.suggestions.push(value.suggestion);
			//		console.log(data.typing.insd);
			//		console.log(value.param.name);
				//var badge=' <span class="label label-danger"><i class="fa fa-exclamation-circle fa-lg"></i> Warning</span>';
					if(data.typing.insd.indexOf(value.param.name)!==-1)$scope.warnings.push(value.warning);

				});
			});

			$scope.printurl = $sce.trustAsResourceUrl('/printview/'+$stateParams.typingId);

		/*	$http.get('/printview/'+$stateParams.typingId).
  success(function(data, status, headers, config) {
		$scope.printhtml_trusted = $sce.trustAsHtml(data);
  }).error(function(data, status, headers, config) {});*/

		};


		$scope.findOneReport = function() {
			$scope.typing = Typings.get({
				typingId: $stateParams.typingId
			});
		};


		$scope.getResultMap=function(){
			$scope.resultmaps=ResultMap.query();
			$scope.getRBC();
		};
		$scope.getRBC=function(){
			$scope.rbcs=$http.post('/rbcs_by_machine',{device:$scope.authentication.user.device}).
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
		};

		$scope.uploadFile = function() {
				var file = $scope.selectedFile[0];
				$scope.upload = $upload.upload({
						url: '/uploadimagetyping',
						method: 'POST',
						fields: {
								typingid: $scope.typing.typingid,
								filedir: 'typing_image'
						},
						file: file
				}).progress(function(evt) {
						$scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
				}).success(function(data) {
						$scope.uploadProgress = 0;

						sweet.swal({
								title: 'Success',
								text: 'อัพโหลดไฟล์สำเร็จ',
								type: 'success'
						}, function(isConfirm) {

								angular.forEach(
										angular.element('input[name=\'uploadfile\']'),
										function(inputElem) {
												angular.element(inputElem).val(null);
										});

						});
						$scope.isCollapsed = true;

				});
		};

		$scope.onFileSelect = function($files) {
				$scope.uploadProgress = 0;
				$scope.selectedFile = $files;
		};

		$scope.printChart=function($id){
			var myWindow=window.open('/printview/'+$id);
	    myWindow.focus();
	    myWindow.print();
		};

		$scope.getDashboardInfo = function() {
			console.log('adfadf');
			$http.get('/dashboard').
		    success(function(data, status, headers, config) {

		      $scope.dashboard = data;
					console.log($scope.dashboard);

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });


		};
		$scope.getTypingParams=function(device,relive){
			var typing={};
			if(!relive)typing=$scope.typingdata;
			else typing=$scope.typing.typing;

			console.log(typing);
			if(device==='CE')
				return {dcip:typing.dcip,hb:typing.hb,mcv:typing.mcv,a:typing.a,a2:typing.a2,hbe:typing.hbe,hbcs:typing.hbcs,bart_h:typing.bart_h};
			else
				return {dcip:typing.dcip,hb:typing.hb,mcv:typing.mcv,a:typing.a,a2e:typing.a2e,hbcs:typing.hbcs,bart_h:typing.bart_h};
		}

		$scope.livecheck=function(){



			$http.post('/typings/live',$scope.getTypingParams($scope.authentication.user.device,false)).
		    success(function(data, status, headers, config) {
		      $scope.liveresult = data.code;
					$scope.suggestions=data.suggestion;

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });
		};

		$scope.relivecheck=function(){
			$http.post('/typings/live',$scope.getTypingParams($scope.authentication.user.device,true)).
		    success(function(data, status, headers, config) {
		      $scope.liveresult = data.code;
					$scope.suggestions=data.suggestion;

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });
		};

		/*$scope.callPage = function callServer(tableState) {
			var ctrl={};
	    ctrl.isLoading = true;

	    var pagination = tableState.pagination;

	    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
	    var number = pagination.number || 10;  // Number of entries showed per page.

	    service.getPage(start, number, tableState).then(function (result) {
	      ctrl.displayed = result.data;
	      tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
	      ctrl.isLoading = false;
	    });
	  };*/
	}
]);
