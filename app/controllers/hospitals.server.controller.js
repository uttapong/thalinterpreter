'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Hospital = mongoose.model('Hospital'),
	_ = require('lodash');

/**
 * Create a Hospital
 */
exports.create = function(req, res) {
	var hospital = new Hospital(req.body);

	hospital.user = req.user;

	hospital.save(function(err) {
		if (err) {
			return res.status(400).send({

				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hospital);
		}
	});
};

/**
 * Show the current Hospital
 */
exports.read = function(req, res) {
	res.jsonp(req.hospital);
};

/**
 * Update a Hospital
 */
exports.update = function(req, res) {
	var hospital = req.hospital ;

	hospital = _.extend(hospital , req.body);

	hospital.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hospital);
		}
	});
};

/**
 * Delete an Hospital
 */
exports.delete = function(req, res) {
	var hospital = req.hospital ;

	hospital.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hospital);
		}
	});
};

/**
 * List of Hospitals
 */
exports.list = function(req, res) {
	Hospital.find().sort('-created').populate('user', 'displayName').exec(function(err, hospitals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hospitals);
		}
	});
};

/**
 * Hospital middleware
 */
exports.hospitalByID = function(req, res, next, id) {
	Hospital.findById(id).populate('user', 'displayName').exec(function(err, hospital) {
		if (err) return next(err);
		if (! hospital) return next(new Error('Failed to load Hospital ' + id));
		req.hospital = hospital ;
		next();
	});
};

/**
 * Hospital authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hospital.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
