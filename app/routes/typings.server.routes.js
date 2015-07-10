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
	var typings = require('../../app/controllers/typings.server.controller');
	var multer=require('multer');
	var bodyParser = require('body-parser');
	var mkdirp = require('mkdirp');

	bodyParser.urlencoded({
			extended: false
		});
	var typing_dir=multer({ dest: './uploads/',
			 rename: function (fieldname, filename) {
			    return filename+Date.now();
			  },
			  changeDest:function(dest,req,res){
					//console.log(req.body);
			  	mkdirp('./uploads/typingimage/'+req.body.typingid+'/', function (err) {
				    if (err) console.error(err);
				    else console.log('create new dir :' +'./uploads/typingimage/'+req.body.typingid+'/');
				});
			  	return './uploads/typingimage/'+req.body.typingid+'/';
			  }
		});
	// Typings Routes
	app.route('/typings')
		.get(users.requiresLogin,typings.list)
		.post(users.requiresLogin, typings.create);

	app.route('/typings/:typingId')
		.get(typings.read)
		.put(users.requiresLogin, typings.hasAuthorization, typings.update)
		.delete(users.requiresLogin, typings.hasAuthorization, typings.delete);
	app.route('/typings/live')
		.post(users.requiresLogin,typings.liveinterprete);
	app.route('/pagetypings')
			.post(users.requiresLogin,typings.list);

	app.route('/searchtypings')
					.post(users.requiresLogin,typings.search);
	// Finish by binding the Typing middleware
	app.param('typingId', typings.typingByID);

	app.route('/uploadimagetyping')
			.post(typing_dir,users.requiresLogin, typings.typingimage);

	app.route('/printview/:printid')
					.get(users.requiresLogin,typings.printview);

	app.param('pdfreport',typings.pdfreport);

	app.route('/typingreport/:printid').get(users.requiresLogin,typings.typingreport);

	app.route('/typingcalendar/:month/:year')
		.get(users.requiresLogin,typings.typingbycalendar);

	app.route('/typingsbydate')
			.post(users.requiresLogin,typings.listbydate);

	app.route('/addtypingsadvice')
					.post(users.requiresLogin,typings.addadvice);

	app.route('/sendmail')
									.post(users.requiresLogin,typings.sendmail);


};
