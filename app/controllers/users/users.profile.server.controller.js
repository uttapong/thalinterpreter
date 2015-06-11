'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');


	//mongoose.set('debug', true);
/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;
	
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};

exports.getcurators=function(req,res){
	User.find({roles:'curator'},function(err,curators){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(curators);
		}

	});
};

exports.searchcurator = function(req, res) {
	var name=req.body.searchName;
	var reg_name=new RegExp(name,'i');
	User.aggregate([
		{$project:  {'fullname': {$concat:["$firstName",' ',"$lastName"]} , 'firstName':1,'email':1,'roles':1 }}
		,{$match:	{ $or:[{firstName: { $regex : reg_name } }, {fullname : { $regex : reg_name} },{email:{ $regex : reg_name } } ] } }
		,{$match:	{roles:{'$ne':'curator'}}  }
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

exports.removecurator = function(req, res) {
	var userid=req.body.id;
	User.update(
		{_id:userid},{$pull:{roles:'curator'}},function(err,doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(doc);

		}
	});
};
