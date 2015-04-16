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
