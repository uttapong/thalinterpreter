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
		.get(typings.list)
		.post(users.requiresLogin, typings.create);

	app.route('/typings/:typingId')
		.get(typings.read)
		.put(users.requiresLogin, typings.hasAuthorization, typings.update)
		.delete(users.requiresLogin, typings.hasAuthorization, typings.delete);
	app.route('/typings/live')
		.post(typings.liveinterprete);
	app.route('/pagetypings')
			.post(typings.list);
	// Finish by binding the Typing middleware
	app.param('typingId', typings.typingByID);

	app.route('/uploadimagetyping')
			.post(typing_dir,users.requiresLogin, typings.typingimage);

	app.route('/printview/:id')
					.get(users.requiresLogin,typings.printview);

	app.param('pdfreport',typings.pdfreport);

};
