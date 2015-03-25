'use strict';
//inject angular file upload directives and services.


var uploadMod = angular.module('uploads').controller('UploadController', ['$scope', '$stateParams', '$location', 'Authentication', 'Uploads', '$upload', 'SweetAlert',
    function($scope, $stateParams, $location, Authentication, Upload, $upload, sweet) { 
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
                $scope.title = 'adfdf';
                $scope.note = 'adfadf';
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

			
		}; 
		$scope.displayedCollection = [].concat($scope.rowCollection);
        $scope.itemsByPage=10;

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
