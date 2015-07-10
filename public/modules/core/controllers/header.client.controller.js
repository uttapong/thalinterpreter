'use strict';

angular.module('core').controller('HeaderController', ['$rootScope','$scope', 'Authentication', 'Menus','$translate','Gravatar','permission',
	function($rootScope,$scope, Authentication, Menus,$translate,Gravatar,Permission) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$rootScope.sidebar=false;
		//console.log(Authentication);
		$scope.lang='en';
		$translate.use($scope.lang);

		Permission.defineRole('anonymous', function (stateParams) {
        // If the returned value is *truthy* then the user has the role, otherwise they don't
        if (!User) {
          return true; // Is anonymous
        }
        return false;
      });

			Permission.defineRole('admin', function (stateParams) {
	        // If the returned value is *truthy* then the user has the role, otherwise they don't
	        if ($scope.authentication.user.roles==='admin') {
	          return true; // Is anonymous
	        }
	        return false;
	      });

			


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

	$scope.isAdmin=function(){
		var admin;

		if($scope.authentication.user)admin=$scope.authentication.user.roles.indexOf('admin')>=0?true:false;//IsAdmin();
		//console.log(admin);
		return admin;
	}

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
