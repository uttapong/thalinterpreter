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
angular.module('rbcs').config(['$stateProvider',
	function($stateProvider) {
		// Rbcs state routing
		$stateProvider.
		state('listRbcs', {
			url: '/rbcs',
			templateUrl: 'modules/rbcs/views/list-rbcs.client.view.html'
		}).
		state('createRbc', {
			url: '/rbcs/create',
			templateUrl: 'modules/rbcs/views/create-rbc.client.view.html'
		}).
		state('viewRbc', {
			url: '/rbcs/:rbcId',
			templateUrl: 'modules/rbcs/views/view-rbc.client.view.html'
		}).
		state('editRbc', {
			url: '/rbcs/:rbcId/edit',
			templateUrl: 'modules/rbcs/views/edit-rbc.client.view.html'
		});
	}
]);