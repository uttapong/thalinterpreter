'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus','$translate','Gravatar',
	function($scope, Authentication, Menus,$translate,Gravatar) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		//console.log(Authentication);
		$scope.lang='en';
		$translate.use($scope.lang);
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.changeLanguage = function (langKey) {
		$scope.lang=langKey;
    $translate.use(langKey);
  };
	$scope.gravatarUrl=function(email){
		return Gravatar(email);
	}
		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
