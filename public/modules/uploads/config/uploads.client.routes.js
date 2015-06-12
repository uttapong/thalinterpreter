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

//Setting up route
angular.module('uploads').config(['$stateProvider',
	function($stateProvider) {
		// Batch interprete state routing
		$stateProvider.
		state('uploads', {
			url: '/uploads',
			templateUrl: 'modules/uploads/views/uploads.client.view.html'
		})
		.state('falseresults', {
			url: '/uploads/:uploadid',
			templateUrl: 'modules/uploads/views/uploads-result.client.view.html'
		});
	}
]);
