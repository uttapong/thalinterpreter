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

// Configuring the Articles module
angular.module('hospitals').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hospitals', 'hospitals', 'dropdown', '/hospitals(/create)?');
		Menus.addSubMenuItem('topbar', 'hospitals', 'List Hospitals', 'hospitals');
		Menus.addSubMenuItem('topbar', 'hospitals', 'New Hospital', 'hospitals/create');
	}
]);