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

	var file_dir='./uploads/'+req.user._id+'/batchtyping/';

	Upload.findOne({ '_id':  uploadid },function(err,upload_doc){
		console.log(upload_doc);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var filename=upload_doc.filename;

			Typing.remove({'upload': uploadid},function(err){
				if(err)throw err;



			fs.readFile(file_dir+filename,{encoding: 'utf-8'},function(err,data){
				if(err)throw err;
				console.log(file_dir+filename);

					var row_count=1;
					csv.parse(data, {}, function(err, outputs){

					async.each(outputs,
						// 2nd param is the function that each item is passed to



						function(output, callback){
							// Call an asynchronous function, often a save() to DB
							if(row_count==1){row_count++;return; }

							var typing=new Typing();
							var typingdata={};
							typing.typingid=output[0];
							typing.gender=output[1];
							typing.age=output[2];
							typingdata['dcip']=thal.numtidy(output[3]);
							typingdata['hb']=thal.numtidy(output[4]);
							typingdata['mcv']=thal.numtidy(output[5]);
							typingdata['mch']=thal.numtidy(output[6]);
							typingdata['a']=thal.numtidy(output[7]);
							typingdata['a2']=thal.numtidy(output[8]);
							typingdata['f']=thal.numtidy(output[9]);
							typingdata['hbe']=thal.numtidy(output[10]);
							typingdata['hbcs']=thal.numtidy(output[11]);
							typingdata['bart_h']=thal.numtidy(output[12]);
							typing['typing']=typingdata;
							typing.clinical_result=output[13];
							typing.user=req.user;
							typing.upload=uploadid;
							typing.interprete_code=thal.interprete(typing,'batch');
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
										if(code_doc.results[j].toUpperCase()==typing.clinical_result.toUpperCase())typing.test_result='TRUE';
									}

								}
								typing.save();

							});
									callback();
						}
					,
						function(err){
							if( err ) {
					      // One of the iterations produced an error.
					      // All processing will now stop.
					      console.log('A file failed to process');
					    } else {
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

					async.each(outputs,
					  // 2nd param is the function that each item is passed to



					  function(output, callback){
					    // Call an asynchronous function, often a save() to DB
							if(row_count==1){row_count++;return; }

					    var typing=new Typing();
							var typingdata={};
					    typing.typingid=output[0];
							typing.gender=output[1];
							typing.age=output[2];
							typingdata['dcip']=thal.numtidy(output[3]);
							typingdata['hb']=thal.numtidy(output[4]);
							typingdata['mcv']=thal.numtidy(output[5]);
							typingdata['mch']=thal.numtidy(output[6]);
							typingdata['a']=thal.numtidy(output[7]);
							typingdata['a2']=thal.numtidy(output[8]);
							typingdata['f']=thal.numtidy(output[9]);
							typingdata['hbe']=thal.numtidy(output[10]);
							typingdata['hbcs']=thal.numtidy(output[11]);
							typingdata['bart_h']=thal.numtidy(output[12]);
							typing['typing']=typingdata;
							typing.clinical_result=output[13];
							typing.user=req.user;
							typing.upload=uploadid;
							typing.interprete_code=thal.interprete(typing,'batch');
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
										if(code_doc.results[j].toUpperCase()==typing.clinical_result.toUpperCase())typing.test_result='TRUE';
									}

								}
								typing.save();

							});
					      	callback();
					  }
					,
					  function(err){
							res.writeHead(500, {'Content-Type': 'application/json'});
							res.write('{error: "' + err + '"}');
							res.end();
						}
					);
				});//end csv parse

			});//end read file
		}
	});








};
