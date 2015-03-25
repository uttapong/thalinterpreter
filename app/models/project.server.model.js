'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ProjectSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	desc: {
		type: Array
	},
	member: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Project', ProjectSchema);