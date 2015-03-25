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


app.route('/batchupload')
		.get(users.requiresLogin,upload.list)
		.post(typing_dir,users.requiresLogin, upload.create);
	

	// Finish by binding the Resultmap middleware
	//app.param('resultmapId', resultmaps.resultmapByID);
};
