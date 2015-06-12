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
 * Rbc Schema
 */
var RbcSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Rbc name',
		trim: true
	},
	unit: {
		type: String,
		default: '',
		required: 'Please fill Rbc Unit',
		trim: true
	},
	label: {
		type: String,
		required: 'Please specify label',
		trim: true
	},
	min: {
		type: Number
	},
	max:{
		type:Number
	},
	comment:{
		type: String,
		trim:true
	},
	warning:{
		type: String,
		trim:true
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

mongoose.model('Rbc', RbcSchema);
