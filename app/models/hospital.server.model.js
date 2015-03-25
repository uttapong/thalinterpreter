'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hospital Schema
 */
var HospitalSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hospital name',
		trim: true
	},
	address: {
		type: String,
		default: '',
		required: 'Please fill Hospital address',
		trim: true
	},
	contact_person: {
		type: String,
		default: '',
		required: 'Please fill Hospital\' contact person',
		trim: true
	},
	contact_number: {
		type: String,
		default: '',
		required: 'Please fill Hospital contact number(s)',
		trim: true
	},
	location: {
		type: String,
		default: '',
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

mongoose.model('Hospital', HospitalSchema);