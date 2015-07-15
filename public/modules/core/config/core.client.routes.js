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
		}).
		state('showHistogram', {
			url: '/showhistogram',
			templateUrl: 'modules/core/views/histogram.client.view.html'
		}).state('index', {
			url: '/',
			templateUrl: 'modules/core/views/intro.client.view.html'
		});
	}
]);
