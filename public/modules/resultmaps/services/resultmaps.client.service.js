'use strict';

//Resultmaps service used to communicate Resultmaps REST endpoints
angular.module('resultmaps').factory('Resultmaps', ['$resource',
	function($resource) {
		return $resource('resultmaps/:resultmapId', { resultmapId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);