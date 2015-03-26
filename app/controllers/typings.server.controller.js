'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Typing = mongoose.model('Typing'),
	ResultMap = mongoose.model('ResultMap'),
	thal=require('thal-interpreter'),
	_ = require('lodash');

/**
 * Create a Typing
 */
exports.create = function(req, res) {
	var typing = new Typing(req.body);
	typing.user = req.user;
	if(typing.mch&&typing.mch!=''&&typing.mch!='-')typing.interprete_code=thal.interprete_withMCH(typing);
	else typing.interprete_code=thal.interprete_noMCH(typing);

	ResultMap.findOne({ 'code':  typing.interprete_code },function(error,code_doc){
		if(error) {
		//	console.log(typing);

		  console.log(error);
		}
		if(code_doc){
			console.log(typing);
			typing.resultmap=code_doc._id;

		}
		typing.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(typing);
			}
		});

		});

	
};

/**
 * Show the current Typing
 */
exports.read = function(req, res) {
	res.jsonp(req.typing);
};

/**
 * Update a Typing
 */
exports.update = function(req, res) {
	var typing = req.typing ;

	typing = _.extend(typing , req.body);

	typing.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(typing);
		}
	});
};

/**
 * Delete an Typing
 */
exports.delete = function(req, res) {
	var typing = req.typing ;

	typing.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(typing);
		}
	});
};

/**
 * List of Typings
 */
exports.list = function(req, res) { 
	Typing.find().sort('-created').populate('user', 'displayName').limit(20).exec(function(err, typings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(typings);
		}
	});
};

/**
 * Typing middleware
 */
exports.typingByID = function(req, res, next, id) { 
	Typing.findById(id).populate('user', 'displayName').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + id));
		req.typing = typing ;
		next();
	});
};

/**
 * Typing authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.typing.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.liveinterprete = function(req, res, next) {
	console.log(req);
	var result=thal.liveinterprete(req);
	res.jsonp(result);
};
