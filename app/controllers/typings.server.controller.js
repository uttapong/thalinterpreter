'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Typing = mongoose.model('Typing'),
	ResultMap = mongoose.model('ResultMap'),
	Suggestion=mongoose.model('Suggestion'),
	Upload=mongoose.model('Upload'),
	thal=require('thal-interpreter'),
	mongoosePaginate = require('mongoose-paginate'),
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
	var interprete_result=thal.interprete(typing,'single');
	typing.interprete_code=interprete_result.result;

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
exports.update = function(req, res,next) {



	var typing = req.typing ;

	typing = _.extend(typing , req.body);

	typing.user = req.user;
	var interprete_result=thal.interprete(req.typing,'single');
	typing.interprete_code=interprete_result.result;

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
				//exports.typingreport(req,res,next);
				//res.jsonp(typing);
				Typing.findById(req.params.typingId).populate('user', 'displayName').populate('resultmap','code results color comment').exec(function(err, typing_result) {
					if (err) return next(err);
					if (! typing_result) return next(new Error('Failed to load Typing ' + req.params.printid));
					Suggestion.find({resultmap:typing_result.resultmap}).populate('param','name').sort('param').exec(function(err2, suggestions) {
						if (err2) return next(err2);
						res.json({typing:typing_result,suggestion:suggestions}) ;
						res.end();
				});
				});
			}
		});

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
};

exports.search = function(req, res) {
	console.log(req.body);
	var keyword=req.body.keyword;
	var page=req.body.page || 1;
	var perpage=req.body.perpage || 10;
	Typing.find({typingid: { $regex : new RegExp(keyword,'i') } }).sort('-created').populate('user', 'displayName').skip(page*perpage-perpage).limit(perpage).exec(function(err, typings) {
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
};


exports.listbydate = function(req, res) {
	console.log(req.body);
	var page=req.body.page || 1;
	var perpage=req.body.perpage || 10;
	var qDate=new Date(req.body.year,parseInt(req.body.month)-1,req.body.date);
	console.log(qDate);
	var qDateAfter=new Date(req.body.year,parseInt(req.body.month)-1,parseInt(req.body.date)+1);
	console.log(qDateAfter);
	Typing.find({"created":{"$gte":qDate,"$lt":qDateAfter}}).sort('-created').populate('user', 'displayName').skip(page*perpage-perpage).limit(perpage).exec(function(err, typings) {
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
	ResultMap.findOne({ 'code':  result.result },function(error,code_doc){
		if(error) {
		  console.log(error);
		}
		if(code_doc){

			Suggestion.find({resultmap:code_doc._id}).populate('param','name').sort('param').exec(function(err2, suggestions) {
				if (err2) return next(err2);
				res.json({code:code_doc,suggestion:suggestions}) ;
				res.end();
			});


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


	Typing.findById(req.params.printid).populate('user', 'displayName').populate('resultmap','code results color comment').exec(function(err, typing) {
		if (err) return next(err);
		if (!typing) return next(new Error('Failed to load Typing ' + req.params.id));
		console.log(typing.typing);
		var baseUrl = req.protocol + '://' + req.get('host');
		res.render('print', {
			user: req.user || null,
			request: req,
			typing:typing,
			baseurl:baseUrl

		});
	});

};

exports.typingreport = function(req, res, next) {

	Typing.findById(req.params.printid).populate('user', 'displayName').populate('resultmap','code results color comment').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + req.params.printid));
		Suggestion.find({resultmap:typing.resultmap}).populate('param','name').sort('param').exec(function(err2, suggestions) {
			if (err2) return next(err2);
			typing.suggestion=suggestions;
			res.json({typing:typing,suggestion:suggestions}) ;
			res.end();
	});
	});
};

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

exports.typingbycalendar=function(req,res,next){
	var result={};
	console.log( typeof req.params.month);
	console.log(typeof req.params.year);
	var param_month=parseInt(req.params.month);
	var param_year=parseInt(req.params.year);
	var startDate=new Date(param_year,param_month-1,1);
	var endDate=new Date(param_year,param_month,1);

	console.log(startDate);
	var typingsarr={};
	var uploadsarr={};
	var result={};
	Typing.find({"created":{"$gte":startDate,"$lt":endDate}},{'created':1,_id:0}).exec(function(err, typings) {
		if (err) {
		res.jsonp({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			for(var i=0;i<typings.length;i++){
				var date=typings[i].created.getDate();
				if(typingsarr[String(date)])typingsarr[String(date)]++;
				else typingsarr[String(date)]=1
			}
				result.typing=typingsarr;

				Upload.find({"created":{"$gte":startDate,"$lt":endDate}},{'created':1,_id:0}).exec(function(err, uploads) {
					if (err) {
					res.jsonp({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						for(var i=0;i<uploads.length;i++){
							var date=uploads[i].created.getDate();
							if(uploadsarr[String(date)])uploadsarr[String(date)]++;
							else uploadsarr[String(date)]=1
						}
							result.upload=uploadsarr;
							res.jsonp(result);


					}
				});


		}
	});
}
/*

{id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false}
{
$project:{
	day:{$dayOfMonth:"$created"},
	month:{$month:"$created"},
	year:{$year:"$created"}
}
},
		{ $group : {
				_id : { date: '$day',  'count' : { $sum : 1 } },
				dailyusage: { $push: { day: '$_id.day', count: '$count' }}
				}
		},{ $match:{
			month:{$eq:req.params.month},
			year:{$eq:req.params.year}
		}
		}
*/

/*
{
$project:{
	day:{$dayOfMonth:"$created"},
	month:{$month:"$created"},
	year:{$year:"$created"},


}
},
{ $group : {
	_id :  {$dayOfMonth:"$created"},  count : { $sum : 1 }
	}
},
	{ $match:{
			month:param_month,
			year:param_year
		}
		}
*/
