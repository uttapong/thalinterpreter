'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
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
			url: '/index',
			templateUrl: 'modules/core/views/intro.client.view.html'
		});
	}
]);
