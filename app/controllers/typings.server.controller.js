/*
 * Copyright (C) 2015 Thalassemia Interpreter Software
 *
 * This file is part of the Thalassemia Interpreter Software project.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 *
 * Thalassemia Interpreter Software project can not be copied and/or distributed without the express
 * permission of National Science and Technology Development Agency,111 Thailand Science Park (TSP),
 * Phahonyothin Road, Khlong Nueng, Khlong Luang, Pathum Thani 12120, Thailand
 */
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
	nodemailer=require('nodemailer'),
	sendmailTransport = require('nodemailer-sendmail-transport'),
//	transporter=nodemailer.createTransport(sendmailTransport()),
	hbs = require('nodemailer-express-handlebars'),
	smtpTransport = require('nodemailer-smtp-transport'),
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
	if(result){

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
	}
	else res.jsonp({});

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

exports.addadvice = function(req, res) {

	// Init Variables
	var typingid = req.body.typing_id;
	var advice = mongoose.Types.ObjectId(req.body.advice);
	var comment = req.body.comment;
//	var userid = req.body.userid;

	// Then save the user
	Typing.update(
		{_id:typingid},{$push:{suggest:{advice:advice,comment:comment,user:req.user._id}}},function(err,doc) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(doc);

		}
	});
};

exports.sendmail = function(req, res) {
	var base_url = req.protocol + '://' + req.get('host') ;
	console.log(base_url);
	var transporter = nodemailer.createTransport(smtpTransport({
    host: 'smtp.mailgun.org',
	    port: 25,
	    auth: {
	        user: 'postmaster@www4a.biotec.or.th',
	        pass: 'aac6cecca06dc7f47a91f66c728c9d15'
	    }
	}));


	// Init Variables
	var typingid = req.body.typing_id;
	var members = req.body.members;
	var members_emails='';

	var html='<html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml" style="font-family: Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;">'+
	  '<head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Request for Interpretation result</title></head>'+
		'<body style="font-family: Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6; background-color: #f6f6f6; margin: 0; padding: 0;" bgcolor="#f6f6f6">'+
		'<table class="body-wrap" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0; padding: 0;" bgcolor="#f6f6f6"><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0;" valign="top"></td>'+
		'<td class="container" width="600" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; width: 100% !important; margin: 0 auto; padding: 0;" valign="top">'+
		'<div class="content" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 10px;">'+
		'<table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; padding: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="alert alert-warning" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: #1A9BAB; margin: 0; padding: 20px;" align="center" bgcolor="#1A9BAB" valign="top">'+
		'Thalassemia Interpreter,  Typing ID: '+typingid+
							'</td>'+
							'</tr><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="content-wrap" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">'+
							'<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="content-block" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
							'<strong>An ambiguous result of Thalassemia interpretation found and we need your help!</strong>'+
							'</td>'+
							'</tr><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="content-block" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
							'Please kindly click the following link to suggest for an correct interpretation<br />'+
							'</td>'+
							'</tr><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="content-block" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
							'<a href="'+base_url+'/#!/advicetyping/'+typingid+'" class="btn-primary" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #1ABC9C; margin: 0; padding: 0; border-color: #1ABC9C; border-style: solid; border-width: 10px 20px;">Click Here!</a>'+
							'</td>'+
							'</tr><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="content-block" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
							'	<p>	Thank you for your help.</p>'+
							' <p>Thalassemia Interpreter Admin</p>'+
							'</td>'+
							'</tr></table></td>'+
							'</tr></table><div class="footer" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">'+
							'<table width="100%" style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><tr style="font-family: Helvetica Neue, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0; padding: 0;"><td class="aligncenter content-block" style="font-family: Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">&copy; Copyright, Biostatistics and Bioinformatics Lab., Genome Technology Research Unit, BIOTEC, NSTDA, Thailand</td>'+
							'</tr></table></div></div>'+
							'</td>'+
							'<td style="font-family: Helvetica Neue, Helvetica, Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0;" valign="top"></td>'+
							'</tr></table></body>'+
							'</html>';
	//console.log(members);
	for(var i=0;i<members.length;i++){
		//console.log(members[i]);
			members_emails=members[i].email+', '+members_emails;
	}
	console.log(members_emails);
	var mailOptions = {
    from: 'Thalassemia Interpreter Admin <bsi@biotec.or.th>', // sender address
    to: members_emails, // list of receivers
    subject: 'Request for Interpretation result for Thalassemia typing ID:'+typingid, // Subject line
//    text: 'Hello world ✔', // plaintext body
    html: html // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
			res.json(members_emails);
        console.log('Message sent: ' + info.response);
    }
});

/*	Typing.findById(typingid).populate('user', 'displayName').exec(function(err, typing) {
		if (err) return next(err);
		if (! typing) return next(new Error('Failed to load Typing ' + id));


		transporter.use('compile', hbs(options));
	});*/
};
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
