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