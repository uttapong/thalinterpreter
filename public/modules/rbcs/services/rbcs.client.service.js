'use strict';

//Rbcs service used to communicate Rbcs REST endpoints
angular.module('rbcs').factory('Rbcs', ['$resource',
	function($resource) {
		return $resource('rbcs/:rbcId', { rbcId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);