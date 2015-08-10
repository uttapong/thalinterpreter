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
	var calendars = require('../../app/controllers/calendars.server.controller');

	// Calendars Routes
	app.route('/calendars')
		.get(users.requiresLogin,calendars.list)
		.post(users.requiresLogin, calendars.create);

	app.route('/calendars/:calendarId')
		.get(calendars.read)
		.put(users.requiresLogin, calendars.update)
		.delete(users.requiresLogin, calendars.hasAuthorization, calendars.delete);

	// Finish by binding the Calendar middleware
	app.param('calendarId', calendars.calendarByID);
};
