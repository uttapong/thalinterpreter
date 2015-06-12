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

//Menu service used for managing  menus
angular.module('core').factory('Gravatar', [

	function GravatarFactory() {
		// Define a set of default roles
		var avatarSize=46;
		var avatarUrl='http://www.gravatar.com/avatar/';
		return function(email){
			return avatarUrl+CryptoJS.MD5(email)+'?size='+avatarSize.toString();
		}
	}
]);

angular.module('core').factory('IsAdmin', ['$scope',

	function IsAdminFactory() {
		// Define a set of default roles
		var roles=$scope.authentication.user.roles;
		$scope.authentication.user.admin= roles.indexOf('admin')>=0?true:false;
	/*	return function(email){
			return avatarUrl+CryptoJS.MD5(email)+'?size='+avatarSize.toString();
		}*/
	}
]);
