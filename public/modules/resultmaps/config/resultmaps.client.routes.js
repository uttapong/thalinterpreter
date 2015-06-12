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
angular.module('resultmaps').config(['$stateProvider',
	function($stateProvider) {
		// Resultmaps state routing
		$stateProvider.
		state('listResultmaps', {
			url: '/resultmaps',
			templateUrl: 'modules/resultmaps/views/list-resultmaps.client.view.html'
		}).
		state('createResultmap', {
			url: '/resultmaps/create',
			templateUrl: 'modules/resultmaps/views/create-resultmap.client.view.html'
		}).
		state('viewResultmap', {
			url: '/resultmaps/:resultmapId',
			templateUrl: 'modules/resultmaps/views/view-resultmap.client.view.html'
		}).
		state('editResultmap', {
			url: '/resultmaps/:resultmapId/edit',
			templateUrl: 'modules/resultmaps/views/edit-resultmap.client.view.html'
		});
	}
]);