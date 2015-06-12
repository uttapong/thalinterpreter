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


angular.module('core').controller('SystemController', ['$scope', 'Authentication','$http',
	function($scope, Authentication,http) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.getinfo=function(){


		http.get('/systeminfo').
		  success(function(data, status, headers, config) {
		    $scope.os=data;
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		};
	}
]);
