'use strict';

//Setting up route
angular.module('uploads').config(['$stateProvider',
	function($stateProvider) {
		// Batch interprete state routing
		$stateProvider.
		state('uploads', {
			url: '/uploads',
			templateUrl: 'modules/uploads/views/uploads.client.view.html'
		});
	}
]);


