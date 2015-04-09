'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Suggestion Schema
 */
var SuggestionSchema = new Schema({
	param: {
		type: Schema.ObjectId,
		ref: 'Rbc'
	},
	resultmap: {
		type: Schema.ObjectId,
		ref: 'ResultMap'
	},
	suggestion: {
		type: String,
		trim: true
	},
	warning: {
		type: String,
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

mongoose.model('Suggestion', SuggestionSchema);
