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
angular.module('hospitals').config(['$stateProvider',
	function($stateProvider) {
		// Hospitals state routing
		$stateProvider.
		state('listHospitals', {
			url: '/hospitals',
			templateUrl: 'modules/hospitals/views/list-hospitals.client.view.html'
		}).
		state('createHospital', {
			url: '/hospitals/create',
			templateUrl: 'modules/hospitals/views/create-hospital.client.view.html'
		}).
		state('viewHospital', {
			url: '/hospitals/:hospitalId',
			templateUrl: 'modules/hospitals/views/view-hospital.client.view.html'
		}).
		state('editHospital', {
			url: '/hospitals/:hospitalId/edit',
			templateUrl: 'modules/hospitals/views/edit-hospital.client.view.html'
		});
	}
]);