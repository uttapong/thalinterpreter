'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Rbc = mongoose.model('Rbc'),
	_ = require('lodash');

/**
 * Create a Rbc
 */
exports.create = function(req, res) {
	var rbc = new Rbc(req.body);
	rbc.user = req.user;

	rbc.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rbc);
		}
	});
};

/**
 * Show the current Rbc
 */
exports.read = function(req, res) {
	res.jsonp(req.rbc);
};

/**
 * Update a Rbc
 */
exports.update = function(req, res) {
	var rbc = req.rbc ;

	rbc = _.extend(rbc , req.body);

	rbc.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rbc);
		}
	});
};

/**
 * Delete an Rbc
 */
exports.delete = function(req, res) {
	var rbc = req.rbc ;

	rbc.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rbc);
		}
	});
};

/**
 * List of Rbcs
 */
exports.list = function(req, res) {
	if(req.body.device=='CE')
	{
		Rbc.find({name:{'$ne':'a2e'}}).sort('-created').populate('user', 'displayName').exec(function(err, rbcs) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(rbcs);
			}
		});
	}
	else{
		Rbc.find({name:{'$nin':['hbe','a2']}}).sort('-created').populate('user', 'displayName').exec(function(err, rbcs) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(rbcs);
			}
		});

	}
};

/**
 * Rbc middleware
 */
exports.rbcByID = function(req, res, next, id) {
	Rbc.findById(id).populate('user', 'displayName').exec(function(err, rbc) {
		if (err) return next(err);
		if (! rbc) return next(new Error('Failed to load Rbc ' + id));
		req.rbc = rbc ;
		next();
	});
};

/**
 * Rbc authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rbc.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
