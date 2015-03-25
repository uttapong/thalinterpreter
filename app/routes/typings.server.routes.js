'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var typings = require('../../app/controllers/typings.server.controller');

	// Typings Routes
	app.route('/typings')
		.get(typings.list)
		.post(users.requiresLogin, typings.create);

	app.route('/typings/:typingId')
		.get(typings.read)
		.put(users.requiresLogin, typings.hasAuthorization, typings.update)
		.delete(users.requiresLogin, typings.hasAuthorization, typings.delete);
	app.route('/typings/live')
		.post(typings.liveinterprete);
	// Finish by binding the Typing middleware
	app.param('typingId', typings.typingByID); 
};
