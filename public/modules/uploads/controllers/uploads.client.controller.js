'use strict';
//inject angular file upload directives and services.


var uploadMod = angular.module('uploads').controller('UploadController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Uploads', '$upload', 'SweetAlert','Typings',
    function($http,$scope, $stateParams, $location, Authentication, Upload, $upload, sweet,typing) {
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


        $scope.uploadFile = function() {
            var file = $scope.selectedFile[0];
            $scope.upload = $upload.upload({
                url: '/batchupload',
                method: 'POST',
                fields: {
                    title: $scope.title,
                    note: $scope.note,
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
           if(data=='Success')sweet.swal("Success", "All data has been successfully reinterpreted.", "success");
           console.log(data);
         });
       }

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
