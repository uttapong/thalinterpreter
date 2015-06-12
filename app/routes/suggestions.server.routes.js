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
	var suggestions = require('../../app/controllers/suggestions.server.controller');

	// Suggestions Routes
	app.route('/suggestions')
		.get(suggestions.list)
		.post(users.requiresLogin, suggestions.create);

		app.route('/suggestcombo')
			.get(users.requiresLogin,suggestions.getcombo);

	app.route('/suggestions/:suggestionId')
		.get(suggestions.read)
		.put(users.requiresLogin, suggestions.hasAuthorization, suggestions.update)
		.delete(users.requiresLogin, suggestions.hasAuthorization, suggestions.delete);

	// Finish by binding the Suggestion middleware
	app.param('suggestionId', suggestions.suggestionByID);
};
