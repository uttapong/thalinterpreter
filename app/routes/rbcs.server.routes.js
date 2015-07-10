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
	var rbcs = require('../../app/controllers/rbcs.server.controller');

	// Rbcs Routes
	app.route('/rbcs')
		.get(users.requiresLogin,rbcs.list)
		.post(users.requiresLogin, rbcs.create);

	app.route('/rbcs_by_machine')
			.post(users.requiresLogin,rbcs.list);

	app.route('/rbcs/:rbcId')
		.get(rbcs.read)
		.put(users.requiresLogin, rbcs.hasAuthorization, rbcs.update)
		.delete(users.requiresLogin, rbcs.hasAuthorization, rbcs.delete);

	// Finish by binding the Rbc middleware
	app.param('rbcId', rbcs.rbcByID);
};
