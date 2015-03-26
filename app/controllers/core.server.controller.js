'use strict';

/**
 * Module dependencies.
 */
 var os = require('os'),
	_ = require('lodash');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.system=function(req,res){
	res.jsonp({
		hostname:os.hostname(),
		type:os.type(),
		platform:os.platform(),
		arch:os.arch(),
		release:os.release(),
		uptime: os.uptime(),
		loadavg:os.loadavg(),
		totalmem:os.totalmem(),
		freemem:os.freemem(),
		cpus:os.cpus()

	});
};