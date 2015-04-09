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
