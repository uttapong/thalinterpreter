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

//Typings service used to communicate Typings REST endpoints
angular.module('typings').factory('AllTypings', ['$resource',
	function($resource) {
		return $resource('typings/:typingId', { typingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

angular.module('typings').factory('PageTypings', ['$resource','$http',
	function($resource,$http) {
		return{
		getResults : function(page,perpage) {
				return $http({
						url: 'pagetypings/',
						method: 'POST',
						data:{page:page,perpage:perpage}
				});
		},
		search : function(page,perpage,keyword) {
				return $http({
						url: 'searchtypings/',
						method: 'POST',
						data:{page:page,perpage:perpage,keyword:keyword}
				});
		},

	};
	}
]);

angular.module('typings').factory('ResultMap', ['$resource',
	function($resource) {
		return $resource('resultmaps/:resultmapId', { resultmapId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
