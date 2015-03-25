'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var BatchResultSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	patient_id: {
		type: Number,
		required: 'Patient ID cannot be blank'
	},
	resultmap: {
		type: Schema.ObjectId,
		ref: 'ResultMap'
	},
	submitter: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('BatchResult', BatchResultSchema);