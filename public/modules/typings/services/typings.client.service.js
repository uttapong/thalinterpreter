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


