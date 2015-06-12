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
