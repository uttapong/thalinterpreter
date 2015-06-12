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