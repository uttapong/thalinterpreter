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
