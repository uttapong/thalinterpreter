'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rbcs = require('../../app/controllers/rbcs.server.controller');

	// Rbcs Routes
	app.route('/rbcs')
		.get(rbcs.list)
		.post(users.requiresLogin, rbcs.create);

	app.route('/rbcs/:rbcId')
		.get(rbcs.read)
		.put(users.requiresLogin, rbcs.hasAuthorization, rbcs.update)
		.delete(users.requiresLogin, rbcs.hasAuthorization, rbcs.delete);

	// Finish by binding the Rbc middleware
	app.param('rbcId', rbcs.rbcByID);
};
