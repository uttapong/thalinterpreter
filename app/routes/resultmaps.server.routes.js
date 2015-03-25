'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var resultmaps = require('../../app/controllers/resultmaps.server.controller');

	// Resultmaps Routes
	app.route('/resultmaps')
		.get(resultmaps.list)
		.post(users.requiresLogin, resultmaps.create);

	app.route('/resultmaps/:resultmapId')
		.get(resultmaps.read)
		.put(users.requiresLogin, resultmaps.hasAuthorization, resultmaps.update)
		.delete(users.requiresLogin, resultmaps.hasAuthorization, resultmaps.delete);

	// Finish by binding the Resultmap middleware
	app.param('resultmapId', resultmaps.resultmapByID);
};
