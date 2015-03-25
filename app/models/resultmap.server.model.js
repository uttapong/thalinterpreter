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
		required: 'list cannot be blank'
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ResultMap', ResultMapSchema);