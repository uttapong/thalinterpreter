'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

	app.route('/systeminfo').get(core.system);
	app.route('/dashboard').get(core.dashboard);
	app.route('/mongobackup').get(core.mongobackup);
};
