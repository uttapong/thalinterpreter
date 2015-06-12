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
//inject angular file upload directives and services.


var uploadMod = angular.module('uploads').controller('UploadController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Uploads', '$upload', 'SweetAlert','Typings','UploadsService',
    function($http,$scope, $stateParams, $location, Authentication, Upload, $upload, sweet,typing,uploadservice) {
        $scope.authentication = Authentication;

        $scope.dropzoneConfig = {
            parallelUploads: 3,
            maxFileSize: 30
        };
        //$scope.title = 'test title';
        //$scope.note = 'test note';
        $scope.model = {};
        $scope.selectedFile = [];
        $scope.uploadProgress = 0;
        $scope.isCollapsed = true;
        $scope.systemchoice = [{
    				  id: 'LPLC,HPLC',
    				  label: 'LPLC,HPLC',
    				  subItem: { name: 'LPLC,HPLC' }
    				}, {
    				  id: 'CE',
    				  label: 'CE',
    				  subItem: { name: 'CE' }
    				}];
    		$scope.system=$scope.systemchoice[0];

        $scope.uploadFile = function() {
            var file = $scope.selectedFile[0];
            $scope.upload = $upload.upload({
                url: '/batchupload',
                method: 'POST',
                fields: {
                    title: $scope.title,
                    note: $scope.note,
                    device:$scope.system.id,
                    filedir: 'hbtyping'
                },
                file: file
            }).progress(function(evt) {
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
            }).success(function(data) {
                $scope.title = '';
                $scope.note = '';
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
                    $scope.find();

                });
                $scope.isCollapsed = true;

            });
        };

        $scope.onFileSelect = function($files) {
            $scope.uploadProgress = 0;
            $scope.selectedFile = $files;
        };

        $scope.find = function() {

			$scope.rowCollection = Upload.query();
      $scope.itemsByPage=10;

		  };
        $scope.uploadResults = function() {
          typing.getResults($stateParams.uploadid).success(function(data){
            $scope.rowCollection =data.typings;
            $scope.alltypings=data.count;
          });

          $scope.itemsByPage=100;
        };

		   $scope.displayedCollection = [].concat($scope.rowCollection);
       $scope.reinterprete=function(uploadid){
         $http({
             url: 'reinterprete/'+uploadid,
             method: 'GET'
         }).success(function(data){
           if(data==='Success')sweet.swal('Success', 'All data has been successfully reinterpreted.', 'success');
           console.log(data);
         });
       };
       $scope.confirmRemove=function(upload){
        sweet.swal({
           title: "Are you sure?",
           text: "This will remove the uploaded file and the conresponded typing profiles!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",
           confirmButtonText: "Yes, delete it!",
           closeOnConfirm: true},
        function(){
           $scope.remove(upload);
        });
       }
       $scope.remove = function(upload) {
   			if ( upload ) {
   				upload.$remove(function(){
             for (var i in $scope.typings) {
     					if ($scope.typings [i] === upload) {

     						$scope.typings.splice(i, 1);
     					}
     				}
             $scope.find();
            $location.path('uploads');

           });



   			} else {
   				$scope.upload.$remove(function() {
   					$location.path('uploads');
   				});
   			}
   		};

    }
]);

uploadMod.directive('progressBar', [
    function() {
        return {
            link: function($scope, el, attrs) {
                $scope.$watch(attrs.progressBar, function(newValue) {
                    el.css('width', newValue.toString() + '%');
                });
            }
        };
    }
]);
