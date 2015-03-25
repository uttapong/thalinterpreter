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