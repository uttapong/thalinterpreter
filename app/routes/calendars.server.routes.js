'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var calendars = require('../../app/controllers/calendars.server.controller');

	// Calendars Routes
	app.route('/calendars')
		.get(calendars.list)
		.post(users.requiresLogin, calendars.create);

	app.route('/calendars/:calendarId')
		.get(calendars.read)
		.put(users.requiresLogin, calendars.hasAuthorization, calendars.update)
		.delete(users.requiresLogin, calendars.hasAuthorization, calendars.delete);

	// Finish by binding the Calendar middleware
	app.param('calendarId', calendars.calendarByID);
};
