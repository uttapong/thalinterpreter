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

angular.module('uploads').factory('UploadsService', ['$resource',
	function($resource) {
		return $resource('upload/:id', {
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
