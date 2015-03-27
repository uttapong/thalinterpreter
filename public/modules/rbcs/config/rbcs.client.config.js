'use strict';

// Configuring the Articles module
angular.module('rbcs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rbcs', 'rbcs', 'dropdown', '/rbcs(/create)?');
		Menus.addSubMenuItem('topbar', 'rbcs', 'List Rbcs', 'rbcs');
		Menus.addSubMenuItem('topbar', 'rbcs', 'New Rbc', 'rbcs/create');
	}
]);