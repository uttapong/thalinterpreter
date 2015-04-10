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

angular.module('uploads').factory('Typings', ['$resource','$http',

	function($resource,$http) {
		return{
    getResults : function(uploadid) {
        return $http({
            url: 'uploadresults/'+uploadid,
            method: 'GET'
        });
    }
	};
}
]);
