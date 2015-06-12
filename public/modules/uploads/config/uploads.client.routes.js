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
