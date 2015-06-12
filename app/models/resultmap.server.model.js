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
var ResultMapSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	numcode: {
		type: Number,
		//required: 'Code Number cannot be blank'

	},
	code: {
		type: String,
		trim: true,
		required: 'Result code cannot be blank'

	},
	results: [{
		type: String,
		required: 'Dictionary list cannot be blank',
		trim:true
	}],
	color:{
		type:String,
		default: '#ccc'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comment: {
		type: String,
		trim: true
	}
});

mongoose.model('ResultMap', ResultMapSchema);
