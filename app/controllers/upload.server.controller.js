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
	Upload = mongoose.model('Upload'),
	Typing = mongoose.model('Typing'),
	ResultMap = mongoose.model('ResultMap'),
	multiparty=require('multiparty'),
	multer=require('multer'),
	util=require('util'),
	trim = require('trim'),
	fs=require('fs'),
	csv=require('csv'),
	wait=require('wait.for'),
	thal=require('thal-interpreter'),
	async=require('async'),
	ObjectId = require('mongoose').Types.ObjectId,
	_ = require('lodash');


 exports.list = function(req, res) {
	Upload.find().sort('-created').exec(function(err, uploads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(uploads);
		}
	});
};

exports.delete = function(req, res) {
	var upload = req.upload ;

	upload.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			Typing.remove({upload:upload._id},function(err2) {
				if (err2) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {

					res.jsonp(upload);
				}
			});

		}
	});
};

exports.hasAuthorization = function(req, res, next) {
	if (req.upload.user.id !== req.user.id && _.indexOf(req.upload.user.roles,'admin')!==-1) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.uploadByID = function(req, res, next, id) {
	Upload.findById(id).populate('user', 'displayName').exec(function(err, upload) {
		if (err) return next(err);
		if (! upload) return next(new Error('Failed to load Typing ' + id));
		req.upload = upload ;
		next();
	});
};

exports.listFalse = function(req, res, next, uploadid) {
//	res.json(uploadid);
var results={};
Typing.find({test_result:'FALSE',upload:new ObjectId(uploadid)},'upload typingid test_result clinical_result interprete_code created').sort('-created').populate('upload','title note user').populate('upload.user').exec(function(err, typings) {
	if (err) {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	} else {
		Typing.count({upload:uploadid}, function (err, count) {
			res.json({typings:typings,count:count});
		});

	}
});


};

exports.reInterprete = function(req, res, next, uploadid) {

	//console.log('adfadfadfadfadfadfdafadfdaf');

 	//res.end('processing');

	Upload.findOne({ '_id':  uploadid },function(err,upload_doc){
		console.log(upload_doc);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var file_dir='./uploads/'+upload_doc.user+'/batchtyping/';
			var filename=upload_doc.filename;

			Typing.remove({'upload': uploadid},function(err){
				if(err)throw err;



			fs.readFile(file_dir+filename,{encoding: 'utf-8'},function(err,data){
				if(err)throw err;
				console.log(file_dir+filename);

					var row_count=1;
					csv.parse(data, {}, function(err, outputs){

						var interpreteSuccess=function(){
							res.end('success');
							console.log('interpreted successfull');
						};
					var rowcount=outputs.length-1;
					console.log('row count '+rowcount);
					var inserted_count=0;
					async.each(outputs,
						// 2nd param is the function that each item is passed to



						function(output, callback){

							// Call an asynchronous function, often a save() to DB
							if(row_count===1){row_count++;return; }

							var typing=new Typing();
							var typingdata={};
							typing.device=upload_doc.device;
							typing.typingid=output[0];
							typing.gender=output[1];
							typing.age=output[2];
							typingdata.dcip=thal.numtidy(output[3]);
							typingdata.hb=thal.numtidy(output[4]);
							typingdata.mcv=thal.numtidy(output[5]);
							typingdata.mch=thal.numtidy(output[6]);
							typingdata.a=thal.numtidy(output[7]);
							typingdata.a2=thal.numtidy(output[8]);
							typingdata.f=thal.numtidy(output[9]);
							typingdata.hbe=thal.numtidy(output[10]);
							typingdata.hbcs=thal.numtidy(output[11]);
							typingdata.bart_h=thal.numtidy(output[12]);
							typing.typing=typingdata;
							typing.clinical_result=output[13];
							typing.user=req.user;
							typing.upload=uploadid;
							var interpreted=thal.interprete(typing,'batch')
							typing.interprete_code=interpreted.result;

						  typing.insd=interpreted.boundary;
							//console.log(typing);

							ResultMap.findOne({ 'code':  typing.interprete_code },function(error,code_doc){
								if(error) {
								//	console.log(typing);

									console.log(error);
								}
								if(code_doc){
									//console.log(typing);
									typing.resultmap=code_doc._id;
									typing.test_result='FALSE';
									for(var j=0;j<code_doc.results.length;j++){
										if(code_doc.results[j].toUpperCase().trim()==typing.clinical_result.toUpperCase().trim())typing.test_result='TRUE';
										else console.log(code_doc.results[j].toUpperCase().trim()+","+typing.clinical_result.toUpperCase().trim())
									}

								}
								typing.save(function(err,doc){
									if(err){ console.log(err);} else {
										++inserted_count;
									//	res.json({percent:Math.floor(inserted_count/rowcount)});
									}
									console.log('inserted count '+inserted_count);


									if(inserted_count>=rowcount)res.end('Success');
								});

							});
							callback();
						},
						function(err){
							res.json({result:'end of interprete'});
							if( err ) {
								res.end('fail');
					      // One of the iterations produced an error.
					      // All processing will now stop.
					      console.log('A file failed to process');
					    } else {
								res.end('success');
					      console.log('All typings have been processed successfully');
					    }
						}
					);
				});//end csv parse

			});//end read file
		});//end remove old typings
		}
	});


};

exports.create = function (req, res, next) {
    // console.log(req.files.file.name);
	var upload = new Upload(req.body);
	var file_dir='./uploads/'+req.user._id+'/batchtyping/';
	upload.user = req.user;
	upload.status='new';
	upload.filename=req.files.file.name;
	//console.log(req.user);
	var uploadid;
	upload.save(function(err,obj) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			uploadid=obj._id;
			res.json(upload);


			fs.readFile(file_dir+req.files.file.name,{encoding: 'utf-8'},function(err,data){
				if(err)throw err;
				//console.log(data);

					var row_count=1;
					csv.parse(data, {}, function(err, outputs){
					var interpreteSuccess=function(){
						res.end('success');
						console.log('interpreted successfull');
					};
					async.each(outputs,
					  // 2nd param is the function that each item is passed to

					  function(output, interpreteSuccess){
					    // Call an asynchronous function, often a save() to DB
							if(row_count===1){row_count++;return; }

					    var typing=new Typing();
							var typingdata={};
							typing.device=upload.device;
					    typing.typingid=output[0];
							typing.gender=output[1];
							typing.age=output[2];
							typingdata.dcip=thal.numtidy(output[3]);
							typingdata.hb=thal.numtidy(output[4]);
							typingdata.mcv=thal.numtidy(output[5]);
							typingdata.mch=thal.numtidy(output[6]);
							typingdata.a=thal.numtidy(output[7]);
							typingdata.a2=thal.numtidy(output[8]);
							typingdata.f=thal.numtidy(output[9]);
							typingdata.hbe=thal.numtidy(output[10]);
							typingdata.hbcs=thal.numtidy(output[11]);
							typingdata.bart_h=thal.numtidy(output[12]);
							typing.typing=typingdata;
							typing.clinical_result=output[13];
							typing.user=req.user;
							typing.upload=uploadid;
							var interpreted=thal.interprete(typing,'batch')
							typing.interprete_code=interpreted.result;
							//console.log(typing);

							ResultMap.findOne({ 'code':  typing.interprete_code },function(error,code_doc){
								if(error) {
								//	console.log(typing);

								  console.log(error);
								}
								if(code_doc){
									console.log(typing);
									typing.resultmap=code_doc._id;
									typing.test_result='FALSE';
									for(var j=0;j<code_doc.results.length;j++){
										if(code_doc.results[j].toUpperCase().trim()==typing.clinical_result.toUpperCase().trim())typing.test_result='TRUE';
									}

								}
								typing.save();

							});
							interpreteSuccess();
					  },function(err){
							res.writeHead(500, {'Content-Type': 'application/json'});
							res.write('{error: ' + err + '}');
							res.end();
						}
					);
				});//end csv parse

			});//end read file
		}
	});








};
