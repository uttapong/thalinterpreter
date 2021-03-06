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

// Typings controller
angular.module('typings').controller('TypingsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'AllTypings','PageTypings','ResultMap','Uploads', '$upload','SweetAlert','$sce','ExpertGroups',
	function($http,$scope, $stateParams,$location, Authentication, Typings,PageTypings,ResultMap,Upload, $upload,sweet,$sce,ExpertGroups) {
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
		$scope.add_btn=true;
		$scope.advice_added=false;

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
				abnormal: this.abnormal,
				device: $scope.authentication.user.device,
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

		$scope.search = function() {
		PageTypings.search($scope.currentPage,$scope.perPage,$scope.keyword).success(function(data,status,header,config){
			console.log(data);
			$scope.typingslist=data.typings;
			$scope.totalItems=data.count;
			//$scope.numPages=Math.ceil($scope.totalItems/$scope.perPage);
			//console.log($scope.numPages);
		});


		};

		$scope.findbydate = function() {
			var date=$stateParams.date;
			var month= $stateParams.month;
			var year=$stateParams.year;
			$scope.currentdate=new Date(year,month-1,date);
			$http({
					url: '/typingsbydate',
					method: 'POST',
					data: {page:$scope.currentPage,perpage:$scope.perPage,date:date, month:month, year:year}
			}).success(function(data){
				//console.log(data);
				$scope.typingslist=data.typings;
				$scope.totalItems=data.count;
			});
	/*	PageTypings.getResults($scope.currentPage,$scope.perPage).success(function(data,status,header,config){
			console.log(data);
			$scope.typingslist=data.typings;
			$scope.totalItems=data.count;
			//$scope.numPages=Math.ceil($scope.totalItems/$scope.perPage);
			//console.log($scope.numPages);
		});*/


		};

		// Find existing Typing
		$scope.findOne = function() {
			Typings.get({
				typingId: $stateParams.typingId
			},function(typing){
				$scope.typing = typing;
				console.log(typing.typing);
				$scope.getRBC(typing);

				//console.log($scope.typing);
			});



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

				var alpha_arr=['ALPHA_THAL_2','ALPHA_THAL1_TRAIT','Hb_H','Hb_H_CS','HB_HOMO_CS','HB_CS'];
				//console.log($scope.typing.interprete_code);
				$scope.isalpha=alpha_arr.indexOf($scope.typing.interprete_code)!==-1?true:false;
				console.log($scope.isalpha);
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

			$http({method:'GET',url:'/suggestcombo'}).success(function(data){

				$scope.resultmapcombo=data.resultmaps;
				$scope.resultmap=$scope.resultmapcombo[0];
			});

			$scope.findGroup();

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
			$scope.getRBC($scope.authentication.user.device);
		};
		$scope.getRBC=function(typing){
			$scope.rbcs=$http.post('/rbcs_by_machine',{device:$scope.authentication.user.device}).
		  success(function(data, status, headers, config) {
				$scope.rbcs=data;
			/*	for(i=0;i<data.length;i++){
					$scope.typingdata.push(data[i].name);
				}*/
				$scope.livecheck();
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

			//console.log(typing);
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
					$scope.checkPercent(false);
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
					$scope.checkPercent(true);
		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });
		};

		$scope.addadvice=function(){
			$http.post('/addtypingsadvice',{advice:$scope.resultmap._id,comment: $scope.advicecomment,typing_id:$stateParams.typingId}).
		    success(function(data, status, headers, config) {
					sweet.swal({
							title: 'Success',
							text: 'Your suggestion has been succesfully added.',
							type: 'success'
					}, function() {

					});
					$scope.advice_added=true;

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });
		};

		$scope.findGroup=function(){
		//	console.log(userid);

		 ExpertGroups.query(function(data){
			$scope.allgroups =data;
			$scope.expertgroup =data[0];
		});
		//console.log($scope.hospitals);
		//$scope.findHospitals();
		}

		$scope.checkPercent=function(relive){
			var sum;
			var typing=	$scope.getTypingParams($scope.authentication.user.device,relive);

			var a2e=parseFloat($scope.typingdata['a2e']) || 0;
			var bart_h=parseFloat($scope.typingdata['bart_h']) || 0;
			var hbcs=parseFloat($scope.typingdata['hbcs']) || 0;
			var a2e=parseFloat($scope.typingdata['a2e']) || 0;
			var a=parseFloat($scope.typingdata['a']) || 0;
			var a2=parseFloat($scope.typingdata['a2']) || 0;
			var e=parseFloat($scope.typingdata['hbe']) || 0;

			if($scope.authentication.user.device=='HPLC_LPLC'){

			 sum=	a2e+bart_h+hbcs+a;
			console.log(sum);

				if(sum >100 ){
					sweet.swal("Warning!", "The summary of typing in percent can not exceed 100%!", "error");
					$scope.add_btn=true;
				}
				else {
					if(sum!=0)
					$scope.add_btn=false;
				}
			}
			else if($scope.authentication.user.device=='CE'){
				sum=	a2+e+bart_h+hbcs+a;
				console.log(sum);
				if( sum>100 ){
					sweet.swal("Warning!", "The summary of typing in percent can not exceed 100%!", "error");
					$scope.add_btn=true;
				}
				else 	if(sum!=0)$scope.add_btn=false;
			}
		}

		$scope.sendMail=function(){
			console.log($scope.expertgroup);
			var recipients="";
			angular.forEach($scope.expertgroup.members,function(value,key){
				recipients+="<li>"+value.displayName+"</li>";
			});
			sweet.swal({
   title: "Are you sure?",
   text: "You are sending an email to following recipients<br /><ol style='text-align:left;'>"+recipients+'</ol>',
   type: "warning",
	html:true,
   showCancelButton: true,
   confirmButtonColor: "#DD6B55",
   confirmButtonText: "Send",
   closeOnConfirm: false},
		function(){
				$http.post('/sendmail',{members:$scope.expertgroup.members,typing_id:$stateParams.typingId}).
				success(function(data, status, headers, config) {
					sweet.swal({
							title: 'Success',
							text: 'Your suggestion has been succesfully added.',
							type: 'success'
					}, function() {
						$('.collapse').collapse();
					});

				}).
				error(function(data, status, headers, config) {
					console.log('error');
				});
		});



		}
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
