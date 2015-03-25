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