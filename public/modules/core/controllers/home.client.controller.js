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


angular.module('core').controller('HomeController', ['$rootScope','$scope', 'Authentication','$http','SweetAlert',
	function($rootScope,$scope, Authentication,$http,sweet) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		//$scope.dashboard={};
		//this.testis='adfdaf';
		$rootScope.sidebar=true;
		$scope.getDashboardInfo = function() {

			console.log($scope.authentication.user);
			$http.get('/dashboard').
		    success(function(data, status, headers, config) {
					$scope.doughnut_label=[];
					$scope.doughnut_value=[];
		      $scope.dashboard = data;
					for(var i=0;i<data.hemotype.length;i++){
					//	console.log(data.hemotype[i]);


						$scope.doughnut_value.push(data.hemotype[i].count);
						for(var j=0;j<data.resultmaps.length;j++){
							if(data.resultmaps[j]._id==data.hemotype[i]._id)
							$scope.doughnut_label.push(data.resultmaps[j].results[0]);
						}
					}
					//console.log($scope.dashboard);
					$scope.doughnut_options={segmentShowStroke : false};
					console.log($scope.dashboard);

		    }).
		    error(function(data, status, headers, config) {
		      console.log('error');
		    });


		};

		$scope.startBackupDB=function(){
			$http.get('/mongobackup').success(function(data){
				console.log(data);
				$scope.stdout=data;
				sweet.swal({
						title: 'Backup Success',
						text: 'Your database has been backedup.',
						type: 'success'
				}, function() {	});
			});
		}

		$scope.index=function(){
			$rootScope.sidebar=false;
		}

		$scope.isAdmin=function(){
			var admin=$scope.authentication.user.roles.indexOf('admin')>=0?true:false;//IsAdmin();
			console.log(admin);
			return admin;
		}
	}
]);
