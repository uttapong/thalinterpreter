'use strict';

// Typings controller
angular.module('typings').controller('TypingsController', ['$http','$scope','$filter', '$stateParams', '$location', 'Authentication', 'AllTypings','PageTypings','ResultMap','Uploads', '$upload','SweetAlert','$sce','ExpertGroups','Rbcs',
	function($http,$scope,$filter, $stateParams,$location, Authentication, Typings,PageTypings,ResultMap,Upload, $upload,sweet,$sce,ExpertGroups,Rbcs) {
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
		$scope.rbcs=[];


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
				var log=[];
				$http.post('/rbcs_by_machine',{device:'ALL'}).success(function(rbc_data){


					angular.forEach(rbc_data, function(value, key) {
				 $scope.rbcs.push({order:value.order,label:value.label,name:value.name});
				}, log);
					console.log($scope.rbcs);
				});


				$scope.typing.resultmap.results=cleanArr($scope.typing.resultmap.results);

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
				$scope.suggestions=cleanArr($scope.suggestions);
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
				else if(sum===0 )$scope.add_btn=true;
				else {
					if(sum!=0 )
					$scope.add_btn=false;
				}
			}
			else if($scope.authentication.user.device=='CE'){
				sum=	a2+e+bart_h+hbcs+a;
				console.log(sum);
				if( sum>100  ){
					sweet.swal("Warning!", "The summary of typing in percent can not exceed 100%!", "error");
					$scope.add_btn=true;
				}
				else if(sum===0 )$scope.add_btn=true;
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

		$scope.genReport=function(){
			var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCqRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAAeAAAAWodpAAQAAAABAAAAeAAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENTNiBNYWNpbnRvc2gAAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAHigAwAEAAAAAQAAACMAAAAA/+EK7Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxOEYwQTg3RENFQ0QxMUU0OUI3NkFGMjlCRDcyQjk0NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxOEYwQTg3RUNFQ0QxMUU0OUI3NkFGMjlCRDcyQjk0NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI3NzRDMzM0QTM0RDg0REZFNzRDMUVFRUM1MjFENkU3NiIgc3RSZWY6ZG9jdW1lbnRJRD0iNzc0QzMzNEEzNEQ4NERGRTc0QzFFRUVDNTIxRDZFNzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IMWElDQ19QUk9GSUxFAAEBAAAMSExpbm8CEAAAbW50clJHQiBYWVogB84AAgAJAAYAMQAAYWNzcE1TRlQAAAAASUVDIHNSR0IAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1IUCAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARY3BydAAAAVAAAAAzZGVzYwAAAYQAAABsd3RwdAAAAfAAAAAUYmtwdAAAAgQAAAAUclhZWgAAAhgAAAAUZ1hZWgAAAiwAAAAUYlhZWgAAAkAAAAAUZG1uZAAAAlQAAABwZG1kZAAAAsQAAACIdnVlZAAAA0wAAACGdmlldwAAA9QAAAAkbHVtaQAAA/gAAAAUbWVhcwAABAwAAAAkdGVjaAAABDAAAAAMclRSQwAABDwAAAgMZ1RSQwAABDwAAAgMYlRSQwAABDwAAAgMdGV4dAAAAABDb3B5cmlnaHQgKGMpIDE5OTggSGV3bGV0dC1QYWNrYXJkIENvbXBhbnkAAGRlc2MAAAAAAAAAEnNSR0IgSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAA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';

			var biotecLogo="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCqRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAAeAAAAWodpAAQAAAABAAAAeAAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENTNiBNYWNpbnRvc2gAAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAFCgAwAEAAAAAQAAABsAAAAA/+EK7Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2RkRCQTk1NkNFQ0QxMUU0OUI3NkFGMjlCRDcyQjk0NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2RkRCQTk1N0NFQ0QxMUU0OUI3NkFGMjlCRDcyQjk0NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI3NzRDMzM0QTM0RDg0REZFNzRDMUVFRUM1MjFENkU3NiIgc3RSZWY6ZG9jdW1lbnRJRD0iNzc0QzMzNEEzNEQ4NERGRTc0QzFFRUVDNTIxRDZFNzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/PgD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+IMWElDQ19QUk9GSUxFAAEBAAAMSExpbm8CEAAAbW50clJHQiBYWVogB84AAgAJAAYAMQAAYWNzcE1TRlQAAAAASUVDIHNSR0IAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1IUCAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARY3BydAAAAVAAAAAzZGVzYwAAAYQAAABsd3RwdAAAAfAAAAAUYmtwdAAAAgQAAAAUclhZWgAAAhgAAAAUZ1hZWgAAAiwAAAAUYlhZWgAAAkAAAAAUZG1uZAAAAlQAAABwZG1kZAAAAsQAAACIdnVlZAAAA0wAAACGdmlldwAAA9QAAAAkbHVtaQAAA/gAAAAUbWVhcwAABAwAAAAkdGVjaAAABDAAAAAMclRSQwAABDwAAAgMZ1RSQwAABDwAAAgMYlRSQwAABDwAAAgMdGV4dAAAAABDb3B5cmlnaHQgKGMpIDE5OTggSGV3bGV0dC1QYWNrYXJkIENvbXBhbnkAAGRlc2MAAAAAAAAAEnNSR0IgSUVDNjE5NjYtMi4xAAAAAAAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAADzUQABAAAAARbMWFlaIAAAAAAAAAAAAAAAAAAA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";

			var doc = new jsPDF('portrait','mm','a4');
			doc.addImage(imgData, 'JPEG', 160, 5);
			doc.setFontSize(16);
			doc.setFontType("normal");
			doc.text(15, 20, 'Thalassemia Interpretation Report');
			doc.setFontSize(10);
			doc.text(15, 28, 'Biostatistics and Informatics Laboratory, Genome Technology Research Unit, BIOTEC, NSTDA');

			//first section
			var dateFilter = $filter('date');
			doc.setFontSize(10);
			doc.setLineWidth(0.3);
			doc.line(15, 32, 200, 32);

			doc.setFontType("bold");
			doc.setFontSize(14);

			doc.text(15,40,'Case Data');
			doc.setFontType("normal");
			doc.setFontSize(10);
			doc.text(15,48,'Typing ID: '+$scope.typing.typingid);
			doc.text(15,56,'Submitted Date: '+ dateFilter($scope.typing.created, 'dd MMM yyyy'));
			doc.text(15,64,'Age: '+$scope.typing.age);
			doc.text(15,72,'Gender: '+$scope.typing.gender);

			//second section
			doc.line(15, 80, 200, 80);
			doc.setFontType("bold");
			doc.setFontSize(14);
			doc.text(15,88,'Typing Data');
			doc.setFontType("normal");
			doc.setFontSize(10);

			doc.text(15,96,'A');
			doc.text(15,104,$scope.typing.typing.a.toString());

			doc.text(35,96,'A2');
			doc.text(35,104,$scope.typing.typing.a2.toString());

			doc.text(55,96,'A2E');
			doc.text(55,104,$scope.typing.typing.a2e.toString());

			doc.text(75,96,'Bart\'s/H');
			doc.text(75,104,$scope.typing.typing.bart_h.toString());

			doc.text(95,96,'F');
			doc.text(95,104,$scope.typing.typing.f.toString());

			doc.text(115,96,'HbCS');
			doc.text(115,104,$scope.typing.typing.hbcs.toString());

			doc.text(135,96,'HbE');
			doc.text(135,104,$scope.typing.typing.hbe.toString());

			doc.text(155,96,'MCH');
			doc.text(155,104,$scope.typing.typing.mch.toString());

			doc.text(175,96,'MCV');
			doc.text(175,104,$scope.typing.typing.mcv.toString());

			//third section
			doc.line(15, 112, 200, 112);
			doc.setFontType("bold");
			doc.setFontSize(14);
			doc.text(15,120,'Interpretation');
			doc.setFontType("normal");
			doc.setFontSize(10);
			var rgb=hexToRgb($scope.typing.resultmap.color);
			doc.setTextColor(rgb.r,rgb.g,rgb.b);
			doc.setFontType("bold");
			doc.setFontSize(16);


			var lines=splitLine(doc,$scope.typing.resultmap.results[0]);
			doc.text(15,128,lines);

			var currentLine=128+(8*lines.length);

			doc.setTextColor(0);
			doc.setFontSize(10);
			doc.setFontType("bold");
			doc.text(15,currentLine,'Other possible results');
			doc.setFontType("normal");
			lines=splitLine(doc,$scope.typing.resultmap.results.slice(1).join('\n'));
			doc.text(15,currentLine+8,lines);
			currentLine=currentLine+16+(4*$scope.typing.resultmap.results.slice(1).length);


			if($scope.typing.resultmap.comment){
				doc.setFontType("bold");
				doc.text(15,currentLine,'Comments');
				doc.setFontType("normal");
				lines=splitLine(doc,$scope.typing.resultmap.comment);
				doc.text(15,currentLine+8,lines);
				currentLine=currentLine+8+(8*lines.length);
			}
			if($scope.suggestions.length>0){
				doc.setFontType("bold");
				doc.text(15,currentLine,'Suggestions');
				doc.setFontType("normal");
				var all_suggests=$scope.suggestions.join('\n');
				doc.text(15,currentLine+8,splitLine(doc,all_suggests));
			}

			//footer
			doc.line(15, 270, 200, 270);
			doc.setFontSize(8);
			doc.text(40,278,'Genome Technology Research Unit, National Center for Genetic Engineering and Biotechnology (BIOTEC) ');
			doc.text(40,282,'113 Thailand Science Park, Phahonyothin Road, Khlong Nueng, Khlong Luang, Pathum Thani 12120 Thailand');
			doc.addImage(biotecLogo, 'JPEG', 15, 278);


			doc.save('report_ID_'+$scope.typing.typingid+'.pdf');
		}

		function splitLine(doc,text){
			return doc.splitTextToSize(text,185);
		}
		function cleanArr(arr){
			for(var i=0;i<arr.length;i++){
				arr[i]=arr[i].trim();
			}
			return arr;
		}

		function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
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
