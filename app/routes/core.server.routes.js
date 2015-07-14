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
var users = require('../../app/controllers/users.server.controller');
module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

	app.route('/systeminfo').get(users.requiresLogin,core.system);
	app.route('/dashboard').get(users.requiresLogin,core.dashboard);
	app.route('/mongobackup').get(users.requiresLogin,core.mongobackup);
	app.route('/testhisc').get(core.testhisc);
};
