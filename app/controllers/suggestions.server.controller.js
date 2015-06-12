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
	Suggestion = mongoose.model('Suggestion'),
	ResultMap = mongoose.model('ResultMap'),
	Rbc = mongoose.model('Rbc'),
	_ = require('lodash');

/**
 * Create a Suggestion
 */
exports.create = function(req, res) {
	var suggestion = new Suggestion(req.body);
	suggestion.user = req.user;

	suggestion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Show the current Suggestion
 */
exports.read = function(req, res) {
	res.jsonp(req.suggestion);
};

exports.getcombo=function(req,res){
	var result={};
	ResultMap.find().sort({'numcode':1}).exec(function(err, resultmaps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			result.resultmaps=resultmaps;
			Rbc.find().sort({'label':1}).exec(function(err, rbcs) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					result.rbcs=rbcs;
					res.jsonp(result);
				}
			});
		}
	});
};
/**
 * Update a Suggestion
 */
exports.update = function(req, res) {
	var suggestion = req.suggestion ;

	suggestion = _.extend(suggestion , req.body);

	suggestion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Delete an Suggestion
 */
exports.delete = function(req, res) {
	var suggestion = req.suggestion ;

	suggestion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * List of Suggestions
 */
exports.list = function(req, res) {
	Suggestion.find().sort({'resultmap':1,'created':1}).populate('user', 'displayName').populate('resultmap param').exec(function(err, suggestions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestions);
		}
	});
};

/**
 * Suggestion middleware
 */
exports.suggestionByID = function(req, res, next, id) {
	Suggestion.findById(id).populate('user', 'displayName').populate('resultmap param').exec(function(err, suggestion) {
		if (err) return next(err);
		if (! suggestion) return next(new Error('Failed to load Suggestion ' + id));
		req.suggestion = suggestion ;
		next();
	});
};

/**
 * Suggestion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.suggestion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
