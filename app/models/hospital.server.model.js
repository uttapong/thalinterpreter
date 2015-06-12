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
	Schema = mongoose.Schema;

/**
 * Hospital Schema
 */
var HospitalSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hospital name',
		trim: true
	},
	address: {
		type: String,
		default: '',
		required: 'Please fill Hospital address',
		trim: true
	},
	contact_person: {
		type: String,
		default: '',
		required: 'Please fill Hospital\' contact person',
		trim: true
	},
	contact_number: {
		type: String,
		default: '',
		required: 'Please fill Hospital contact number(s)',
		trim: true
	},
	location: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Hospital', HospitalSchema);
