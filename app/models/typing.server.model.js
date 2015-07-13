'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Typing Schema
 */
var TypingSchema = new Schema({
	typingid: {
		type: String,
		default: 'unknown',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	gender: {
		type: String,
		default: '',
		trim: true,
	},
	age: {
		type: String,
		default: '',
		trim: true,
	},
	clinical_result: {
		type: String,
		default: '',
		trim: true,
	},
	interprete_code: {
		type: String,
		default: '',
		trim: true,
	},
	insd:[{
		type:String
	}],
	test_result: {
		type: String,
		default: '',
	},
	resultmap:{
		type: Schema.ObjectId,
		ref:'ResultMap'
	},
	hospital: {
		type: Schema.ObjectId,
		ref: 'Hospital'
	},
	updated:{
		type: Date,
		default: Date.now
	},
	upload:{
		type: Schema.ObjectId,
		ref:'Upload'
	},
	device:{
		type:String,
		required: 'Device cannot be blank'
	},
	typing:
		{
			type:Schema.Types.Mixed,
			trim:true
		},
	image:{
		type: String
	},
	abnormal:{
		type:Boolean,
		default: false
	},
	suggest:[
		{
			type:Schema.Types.Mixed,
			trim:true
		}
	]


});

mongoose.model('Typing', TypingSchema);
