'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Typing = mongoose.model('Typing'),
	ResultMap = mongoose.model('ResultMap'),
	thal=require('thal-interpreter'),
	mongoosePaginate = require('mongoose-paginate'),
	jsreport=require("jsreport"),
	_ = require('lodash');

/**
 * Create a Typing
 */
exports.create = function(req, res) {
	var typing = new Typing(req.body);
	/*console.log(typing);
	typing.save(function(err){
		res.jsonp('xxxx');
	});*/

	typing.user = req.user;
	typing.interprete_code=thal.interprete(typing,'single');

	ResultMap.findOne({ 'code':  typing.interprete_code },function(error,code_doc){
		if(error) {
		//	console.log(typing);

		  console.log(error);
		}
		if(code_doc){
			// console.log(typing);
			typing.resultmap=code_doc._id;

		}
		typing.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(typing);
			}
		});

		});


};

/**
 * Show the current Typing
 */
exports.read = function(req, res) {
	res.jsonp(req.typing);
};

/**
 * Update a Typing
 */
exports.update = function(req, res) {
	var typing = req.typing ;

	typing = _.extend(typing , req.body);

	typing.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(typing);
		}
	});
};

/**
 * Delete an Typing
 */
exports.delete = function(req, res) {
	var typing = req.typing ;

	typing.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(typing);
		}
	});
};

/**
 * List of Typings
 */
exports.list = function(req, res) {
	console.log(req.body);
	var page=req.body.page || 1;
	var perpage=req.body.perpage || 10;
	Typing.find().sort('-created').populate('user', 'displayName').skip(page*perpage-perpage).limit(perpage).exec(function(err, typings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			Typing.count({},function(err,count){
				res.jsonp({typings:typings,count:count});
			});

		}
	});
//	Typing.find(function(err,doc){ });
	/*Typing.paginate=mongoosePaginate;
	Typing.paginate({}, req.body.page, req.body.perpage, function(error, pageCount, paginatedResults, itemCount) {
	  if (error) {
	    console.error(error);
	  } else {
	    console.log('Pages:', pageCount);
	    console.log(paginatedResults);
			res.jsonp({pagecount:pageCount,result:paginateResults,itemcount:itemCount});
	  }
	});*/
};

/**
 * Typing middleware
 */
exports.typingByID = function(req, res, next, id) {
	Typing.findById(id).populate('user', 'displayName').populate('resultmap','code results color comment').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + id));
		req.typing = typing ;
		next();
	});
};


exports.hasAuthorization = function(req, res, next) {
	if (req.typing.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.liveinterprete = function(req, res, next) {
	//console.log(req);
	var result=thal.interprete(req,'live');
	ResultMap.findOne({ 'code':  result },function(error,code_doc){
		if(error) {
		  console.log(error);
		}
		if(code_doc){
			res.jsonp(code_doc);

		}
		});

};



exports.typingimage = function (req, res, next) {
	console.log(req.files.file.name);
    // console.log(req.files.file.name);

//	var file_dir='./uploads/'+req.user._id+'/batchtyping/';
	//upload.filename=req.files.file.name;
	//console.log(req.user);
	//var uploadid;
	Typing.findOne({ typingid:req.body.typingid }, function (err, doc){
	  doc.image=req.files.file.name;
		doc.save(function(err){
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(doc);
			}
		});
	});


};

exports.printview=function(req,res,next){


	Typing.findById(req.params.id).populate('user', 'displayName').populate('resultmap','code results color comment').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + id));
		console.log(typing.typing);
		var baseUrl = req.protocol + '://' + req.get('host');
		res.render('print', {
			user: req.user || null,
			request: req,
			typing:typing,
			baseurl:baseUrl

		});
	});


}

exports.pdfreport=function(req,res,next,id){

	Typing.findById(id).populate('user', 'displayName').populate('resultmap','code results color comment').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + id));
		req.typing = typing ;
		next();
	});

	/*	Typing.findById(id).populate('user', 'displayName').populate('resultmap','code results').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + id));
		req.typing = typing ;
		res.jsonp(typing);
		res.render('print', {
			user: req.user || null,
			request: req,
			typing:typing

		});
	});*/

};
