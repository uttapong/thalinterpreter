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
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Calendar = mongoose.model('Calendar'),
	_ = require('lodash');

/**
 * Create a Calendar
 */
exports.create = function(req, res) {
	var calendar = new Calendar(req.body);
	calendar.user = req.user;
	console.log(calendar.user);
	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * Show the current Calendar
 */
exports.read = function(req, res) {
	res.jsonp(req.calendar);
};

/**
 * Update a Calendar
 */
exports.update = function(req, res) {
	var calendar = req.calendar ;

	calendar = _.extend(calendar , req.body);

	calendar.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * Delete an Calendar
 */
exports.delete = function(req, res) {
	var calendar = req.calendar ;

	calendar.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendar);
		}
	});
};

/**
 * List of Calendars
 */
exports.list = function(req, res) {
	Calendar.find().sort('-created').populate('user', 'displayName').exec(function(err, calendars) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(calendars);
		}
	});
};

/**
 * Calendar middleware
 */
exports.calendarByID = function(req, res, next, id) {
	Calendar.findById(id).populate('user', 'displayName').exec(function(err, calendar) {
		if (err) return next(err);
		if (! calendar) return next(new Error('Failed to load Calendar ' + id));
		req.calendar = calendar ;
		next();
	});
};

/**
 * Calendar authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.calendar.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
