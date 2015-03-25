'use strict';

//Hospitals service used to communicate Hospitals REST endpoints
angular.module('hospitals').factory('Hospitals', ['$resource',
	function($resource) {
		return $resource('hospitals/:hospitalId', { hospitalId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);