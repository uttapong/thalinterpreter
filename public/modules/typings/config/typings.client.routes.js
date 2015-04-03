'use strict';

//Setting up route
angular.module('typings').config(['$stateProvider',
	function($stateProvider) {
		// Typings state routing
		$stateProvider.
		state('listTypings', {
			url: '/typings',
			templateUrl: 'modules/typings/views/list-typings.client.view.html'
		}).
		state('createTyping', {
			url: '/typings/create',
			templateUrl: 'modules/typings/views/create-typing.client.view.html'
		}).
		state('viewTyping', {
			url: '/typings/:typingId',
			templateUrl: 'modules/typings/views/view-typing.client.view.html'
		}).
		state('editTyping', {
			url: '/typings/:typingId/edit',
			templateUrl: 'modules/typings/views/edit-typing.client.view.html'
		}).
		state('viewTypingReport', {
			url: '/typingreport/:typingId',
			templateUrl: 'modules/typings/views/report-typing.client.view.html'
		}).
		state('dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
