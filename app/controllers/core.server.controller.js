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
 User = mongoose.model('User'),
 Typing = mongoose.model('Typing'),
 ResultMap=mongoose.model('ResultMap'),
 	Hospital = mongoose.model('Hospital'),
   os = require('os'),
sys = require('sys'),
exec = require('child_process').exec,
	_ = require('lodash');

exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

exports.mongobackup=function(req,res){
  var child;
  child = exec("grunt mongobackup:dump", function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
    sys.print('stderr: ' + stderr);
    //console.log(stdout);
    res.jsonp(stdout);

    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

exports.system=function(req,res){
	res.jsonp({
		hostname:os.hostname(),
		type:os.type(),
		platform:os.platform(),
		arch:os.arch(),
		release:os.release(),
		uptime: os.uptime(),
		loadavg:os.loadavg(),
		totalmem:os.totalmem(),
		freemem:os.freemem(),
		cpus:os.cpus()

	});
};

exports.dashboard=function(req,res){

var result={};

Typing.aggregate(
    { $group : {
         '_id' : '$resultmap',
         'count' : { $sum : 1 }}
         },
    function (err, obj)
         { if (err) ; // TODO handle error
           //console.log(res);
           result.hemotype=obj;

           Typing.aggregate(
               { $group : {
                    '_id' : {$dayOfYear:'$created"' },
                    'count' : { $sum : 1 }

                    }
                    },
               function (err, obj2)
                    { if (err) ; // TODO handle error
                      //console.log(res);
                      result.monthly=obj2;

                      User.count({ }, function (err, usercount) {
                       result.usercount=usercount;
                       Hospital.count({ }, function (err, hpcount) {
                        result.hospitalcount=hpcount;
                        Typing.count({ }, function (err, typingcount) {
                         result.hemocount=typingcount;
                         User.count({roles:'curator' }, function (err, crcount) {
                          result.curatorcount=crcount;
                            ResultMap.find({}, function (err, resultmaps) {
                              result.resultmaps=resultmaps;
                              res.jsonp(result);
                            });
                          });
                        });
                       });
                      });
                      //res.jsonp(obj);
                    });
           //res.jsonp(obj);
         });


};

exports.normaldist=function(req,res){
    var freq=50;
    var param=req.param;
    Typing.find({},['typing.'+param],{limit:1,sort:{'typing.'+param:-1}}).exec(function(err, max_values) {
  		if (err) return next(err);
  		if (! max_values) return next(new Error('Failed to load max values ' + id));
  		var max_value=max_values[0];

      Typing.find({},['typing.'+param],{limit:1,sort:{'typing.'+param:1}}).exec(function(err, min_values) {
    		if (err) return next(err);
    		if (! min_values) return next(new Error('Failed to load min values ' + id));
    		var min_value=min_values[0];
    	});
  	});
    Typing.aggregate({$project:{'typing.mcv':1}},function(err,obj){

    });
}
