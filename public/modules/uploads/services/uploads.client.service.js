'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('uploads').factory('Uploads', ['$resource',
	function($resource) {
		return $resource('batchupload/:uploadId', {
			uploadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);