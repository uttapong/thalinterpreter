'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Resultmap = mongoose.model('ResultMap'),
	util=require('util'),
	_ = require('lodash');

/**
 * Create a Resultmap
 */
exports.create = function(req, res) {
	var resultmap = new Resultmap(req.body);
	resultmap.user = req.user;
	resultmap.results=req.body.results.split(",");
	resultmap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resultmap);
		}
	});
};

/**
 * Show the current Resultmap
 */
exports.read = function(req, res) {
	res.jsonp(req.resultmap);
};

/**
 * Update a Resultmap
 */
exports.update = function(req, res) {
	//console.log(req.resultmap);
	if(util.isArray(req.body.results)){

		req.body.results=req.body.results[0].split(",");
	//	console.log(resultmap.results);
	}
	else {
		//console.log('not array');
		req.body.results=req.body.results.split(",");
	}


	var resultmap = req.resultmap ;
//	console.log(req.body.results[0]);

	resultmap = _.extend(resultmap , req.body);

	resultmap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resultmap);
		}
	});
};

/**
 * Delete an Resultmap
 */
exports.delete = function(req, res) {
	var resultmap = req.resultmap ;

	resultmap.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resultmap);
		}
	});
};

/**
 * List of Resultmaps
 */
exports.list = function(req, res) {
	Resultmap.find().sort({'numcode':1}).populate('user', 'displayName').exec(function(err, resultmaps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(resultmaps);
		}
	});
};

/**
 * Resultmap middleware
 */
exports.resultmapByID = function(req, res, next, id) {
	Resultmap.findById(id).populate('user', 'displayName').exec(function(err, resultmap) {
		if (err) return next(err);
		if (! resultmap) return next(new Error('Failed to load Resultmap ' + id));
		req.resultmap = resultmap ;
		next();
	});
};

/**
 * Resultmap authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.resultmap.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
