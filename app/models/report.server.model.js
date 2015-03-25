'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ReportSchema = new Schema({
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
	permissiion:[{
		type: Schema.ObjectId,
		ref: 'User' 
	}]
	
});

mongoose.model('Report', ReportSchema); 