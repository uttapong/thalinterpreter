'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ExpertGroupSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank',
		unique: true
	},
	members: [{
		type: Schema.ObjectId,
		ref: 'User',
		unique:true
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('ExpertGroup', ExpertGroupSchema);
