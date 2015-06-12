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

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('system', {
			url: '/system',
			templateUrl: 'modules/core/views/system.client.view.html'
		}).
		state('mongobackup', {
			url: '/mongobackup',
			templateUrl: 'modules/core/views/mongobackup.client.view.html'
		}).state('index', {
			url: '/',
			templateUrl: 'modules/core/views/intro.client.view.html'
		});
	}
]);
