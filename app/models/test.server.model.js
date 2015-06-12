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
 * Article Schema
 */
var TestSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	data: {
		type: String,
		default: '',
		trim: true,
		required: 'Data cannot be blank'
	},
	submitter: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	testcase: [{
		type: Schema.ObjectId,
		ref: 'Patient'
	}]
});

mongoose.model('Test', TestSchema);
