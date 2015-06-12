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

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hospitals = require('../../app/controllers/hospitals.server.controller');

	// Hospitals Routes
	app.route('/hospitals')
		.get(hospitals.list)
		.post(users.requiresLogin, hospitals.create);

	app.route('/hospitals/:hospitalId')
		.get(hospitals.read)
		.put(users.requiresLogin, hospitals.hasAuthorization, hospitals.update)
		.delete(users.requiresLogin, hospitals.hasAuthorization, hospitals.delete);

	// Finish by binding the Hospital middleware
	app.param('hospitalId', hospitals.hospitalByID);
};
