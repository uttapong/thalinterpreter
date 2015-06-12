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
	ExpertGroup = mongoose.model('ExpertGroup'),
	_ = require('lodash'),
	User = mongoose.model('User');

/**
 * Create a expertgroup
 */
exports.create = function(req, res) {
	var expertgroup = new ExpertGroup(req.body);
	expertgroup.user = req.user;

	expertgroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(expertgroup);
		}
	});
};

/**
 * Show the current expertgroup
 */
exports.read = function(req, res) {
	res.json(req.expertgroup);
};

/**
 * Update a expertgroup
 */
exports.update = function(req, res) {
	var expertgroup = req.expertgroup;

	expertgroup = _.extend(expertgroup, req.body);

	expertgroup.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(expertgroup);
		}
	});
};

/**
 * Delete an expertgroup
 */
exports.delete = function(req, res) {
	var expertgroup = req.expertgroup;

	expertgroup.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(expertgroup);
		}
	});
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
	ExpertGroup.find().sort('-created').populate('user', 'displayName').populate('members','displayName email').exec(function(err, articles) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(articles);
		}
	});
};

/**
 * ExpertGroup middleware
 */
exports.articleByID = function(req, res, next, id) {
	ExpertGroup.findById(id).populate('user', 'displayName').populate('members','displayName email').exec(function(err, expertgroup) {
		if (err) return next(err);
		if (!expertgroup) return next(new Error('Failed to load expertgroup ' + id));
		req.expertgroup = expertgroup;
		next();
	});
};

/**
 * ExpertGroup authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.expertgroup.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};

exports.addcuratortogroup = function(req, res) {
	// Init Variables
	var group_id = req.body.group_id;
	var user_id = req.body.user_id;
	// Then save the user
	ExpertGroup.update(
		{_id:group_id},{$push:{members:user_id}},function(err,doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(doc);

		}
	});
};

exports.searchgroupcurator = function(req, res) {
	var name=req.body.searchName;
	var reg_name=new RegExp(name,'i');
	User.aggregate([
		{$project:  {'fullname': {$concat:["$firstName",' ',"$lastName"]} , 'firstName':1,'email':1,'roles':1 }}
		,{$match:	{ $or:[{firstName: { $regex : reg_name } }, {fullname : { $regex : reg_name} },{email:{ $regex : reg_name } } ] } }
		,{$limit: 5}],function(err,curators){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(curators);
		}

	});
};

exports.removegroupcurator = function(req, res) {
	var group_id = req.body.group_id;
	var user_id = req.body.user_id;
	ExpertGroup.update(
		{_id:group_id},{$pull:{members:user_id}},function(err,doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(doc);

		}
	});
};
