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


module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var upload = require('../../app/controllers/upload.server.controller');
var multer=require('multer'),
	bodyParser = require('body-parser'),
	mkdirp = require('mkdirp');
	// Resultmaps Routes

bodyParser.urlencoded({
		extended: false
	});

var typing_dir=multer({ dest: './uploads/',
		 rename: function (fieldname, filename) {
		    return filename+Date.now();
		  },
		  changeDest:function(dest,req,res){
		  	mkdirp('./uploads/'+req.user._id+'/batchtyping/', function (err) {
			    if (err) console.error(err);
			    else console.log('create new dir :' +'./uploads/'+req.user._id+'/batchtyping/');
			});
		  	return './uploads/'+req.user._id+'/batchtyping/';
		  }
	});

/*	app.route('/batchupload')
		.get(upload.list)
		.post(users.requiresLogin, upload.create);

	app.route('/batchupload/:uploadId')
		.get(users.requiresLogin,upload.read)
	//	.put(users.requiresLogin, upload.hasAuthorization, upload.update)
		.delete(users.requiresLogin, upload.hasAuthorization, upload.delete);

app.param('uploadId', upload.uploadByID);*/
app.route('/batchupload')
.get(users.requiresLogin,upload.list)
.post(typing_dir,users.requiresLogin, upload.create);

app.route('/batchupload/:id')
		.delete(users.requiresLogin, upload.hasAuthorization, upload.delete);

app.route('/uploadresults/:uploadid')
				.get(users.requiresLogin,upload.listFalse);

app.route('/reinterprete/:reinterpreteid')
								.get(users.requiresLogin,upload.reInterprete);

	app.param('uploadid', upload.listFalse);

	app.param('reinterpreteid', upload.reInterprete);
	app.param('id', upload.uploadByID);
	// Finish by binding the Resultmap middleware
	//app.param('resultmapId', resultmaps.resultmapByID);
};
