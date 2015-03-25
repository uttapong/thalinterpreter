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
		}
	});

	


	fs.readFile(file_dir+req.files.file.name,{encoding: 'utf-8'},function(err,data){
		if(err)throw err;
		//console.log(data);
		
			var row_count=1;
			csv.parse(data, {}, function(err, outputs){

			async.each(outputs,
			  // 2nd param is the function that each item is passed to
			  function(output, callback){
			    // Call an asynchronous function, often a save() to DB
			   		
			      
			      	var typing=new Typing();
			      	typing.labno=output[4];
					typing.gender=output[6];
					typing.age=output[7];
					typing.dcip=thal.numtidy(output[8]);
					typing.hb=thal.numtidy(output[9]);
					typing.mcv=thal.numtidy(output[10]);
					typing.a=thal.numtidy(output[11]);
					typing.a2=thal.numtidy(output[12]);
					typing.f=thal.numtidy(output[13]);
					typing.hbe=thal.numtidy(output[14]);
					typing.hbcs=thal.numtidy(output[15]);
					typing.bart_h=thal.numtidy(output[16]);
					typing.clinical_result=output[17];
					typing.submitter=req.user;
					typing.upload=uploadid;
					typing.interprete_code=thal.interprete(typing);
					console.log(typing);

					ResultMap.findOne({ 'code':  typing.interprete_code },function(err,code_doc){
						if(code_doc){
							console.log(code_doc);
							typing.resultmap=code_doc._id;
							typing.save();
						}

					});
						
			      	callback();
			 
			  },
			  // 3rd param is the function to call when everything's done
			  function(err){
			    // All tasks are done now
			    //doSomethingOnceAllAreDone();
			  }
			);
				
			/*for (var i = 1, len = output.length; i < len; i++) {
				//var self=this;
				var tp=output[i];
				
				var obj={};
				obj.labno=tp[4];
				obj.gender=tp[6];
				obj.age=tp[7];
				obj.dcip=thal.numtidy(tp[8]);
				obj.hb=thal.numtidy(tp[9]);
				obj.mcv=thal.numtidy(tp[10]);
				obj.a=thal.numtidy(tp[11]);
				obj.a2=thal.numtidy(tp[12]);
				obj.f=thal.numtidy(tp[13]);
				obj.hbe=thal.numtidy(tp[14]);
				obj.hbcs=thal.numtidy(tp[15]);
				obj.bart_h=thal.numtidy(tp[16]);
				obj.clinical_result=tp[17];
				obj.submitter=req.user;
				obj.upload=uploadid;
				obj.interprete_code=thal.interprete(obj);*/
				//typing=typing;
				//console.log(typing.interprete_code);
				//var resultmap=wait.forMethod(ResultMap,'findOne',{code:typing.interprete_code});
				//typing.resultmap=resultmap;
				//typing.save();
				/*
				typing.save(function(err,product,numaffected){
					if(err)return err;
					else {
						row_count++;
						if(row_count==output.length)mapResult();
					}
				});*/
				
				/*
				var mapResult=function(){
					
					var query = Typing.find({ upload: uploadid },function (err, docs) {
						for (var j = 0, len = docs.length; j < len; j++) {
							var doc=docs[i];
							console.log(doc);
							query2=ResultMap.where({ 'code':  doc.interprete_code });
							query2.findOne(function (err, map) {
							  if (err) return err;
							   console.log(map);
							  if (map) {
							   doc.resultmap=map._id;
							    doc.save();
							  }
							  
							 
							});
						};
					});
					

				}*/
				
				

				

			//}//end for
		  //output.should.eql([ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]);
		});//end csv parse

	});

	
	
};



