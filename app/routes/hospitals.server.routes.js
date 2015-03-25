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
