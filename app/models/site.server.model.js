'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SiteSchema = new Schema({
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
	admin: [{
		type: Schema.ObjectId,
		ref: 'User'
	}]
});

mongoose.model('Site', SiteSchema);