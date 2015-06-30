'use strict';

//Setting up route
angular.module('suggestions').config(['$stateProvider',
	function($stateProvider) {
		// Suggestions state routing
		$stateProvider.
		state('listSuggestions', {
			url: '/suggestions',
			templateUrl: 'modules/suggestions/views/list-suggestions.client.view.html'
		}).
		state('createSuggestion', {
			url: '/suggestions/create',
			templateUrl: 'modules/suggestions/views/create-suggestion.client.view.html'
		}).
		state('viewSuggestion', {
			url: '/suggestions/:suggestionId',
			templateUrl: 'modules/suggestions/views/view-suggestion.client.view.html'
		}).
		state('editSuggestion', {
			url: '/suggestions/:suggestionId/edit',
			templateUrl: 'modules/suggestions/views/edit-suggestion.client.view.html'
		});
	}
]);