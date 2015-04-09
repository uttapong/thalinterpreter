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
