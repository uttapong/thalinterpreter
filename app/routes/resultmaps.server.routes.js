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
	var resultmaps = require('../../app/controllers/resultmaps.server.controller');

	// Resultmaps Routes
	app.route('/resultmaps')
		.get(users.requiresLogin,resultmaps.list)
		.post(users.requiresLogin, resultmaps.create);

	app.route('/resultmaps/:resultmapId')
		.get(users.requiresLogin,resultmaps.read)
		.put(users.requiresLogin, resultmaps.update)
		.delete(users.requiresLogin, resultmaps.delete);

	// Finish by binding the Resultmap middleware
	app.param('resultmapId', resultmaps.resultmapByID);

	app.route('/resultmapschoice')
				.get(users.requiresLogin,resultmaps.choicelist)
};
