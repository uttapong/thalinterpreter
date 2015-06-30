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