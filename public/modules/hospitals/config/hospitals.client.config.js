'use strict';

// Configuring the Articles module
angular.module('hospitals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hospitals', 'hospitals', 'dropdown', '/hospitals(/create)?');
		Menus.addSubMenuItem('topbar', 'hospitals', 'List Hospitals', 'hospitals');
		Menus.addSubMenuItem('topbar', 'hospitals', 'New Hospital', 'hospitals/create');
	}
]);