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
	dcip: {
		type: String,
		default: '',
		trim: true,
	},
	hb: {
		type: Number,
		default: '',
		trim: true,
	},
	mcv: {
		type: Number,
		default: '',
		trim: true,
	},
	a: {
		type: Number,
		default: '',
		trim: true,
	},
	a2: {
		type: Number,
		default: '',
		trim: true,
	},
	f: {
		type: Number,
		default: '',
		trim: true,
	},
	hbe: {
		type: Number,
		default: '',
		trim: true,
	},
	hbcs: {
		type: Number,
		default: '',
		trim: true,
	},
	bart_h: {
		type: Number,
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
	}


});

mongoose.model('Typing', TypingSchema);
