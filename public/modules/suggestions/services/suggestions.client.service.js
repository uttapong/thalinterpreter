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

//Suggestions service used to communicate Suggestions REST endpoints
angular.module('suggestions').factory('Suggestions', ['$resource',
	function($resource) {
		return $resource('suggestions/:suggestionId', { suggestionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);