'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	expertgroups = require('../../app/controllers/expertgroup.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/expertgroups')
		.get(expertgroups.list)
		.post(users.requiresLogin, expertgroups.create);

	app.route('/expertgroups/:articleId')
		.get(expertgroups.read)
		.put(users.requiresLogin, expertgroups.hasAuthorization, expertgroups.update)
		.delete(users.requiresLogin, expertgroups.hasAuthorization, expertgroups.delete);

	// Finish by binding the article middleware
	app.param('articleId', expertgroups.articleByID);

	app.route('/addcuratortogroup').post(expertgroups.addcuratortogroup);
	app.route('/searchgroupcurator').post(expertgroups.searchgroupcurator);
	app.route('/removegroupcurator').post(expertgroups.removegroupcurator);
};
