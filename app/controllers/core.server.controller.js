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
  ResultMap = mongoose.model('ResultMap'),
  Hospital = mongoose.model('Hospital'),
  histc = require('histc'),
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

exports.mongobackup = function(req, res) {
  var child;
  child = exec("grunt mongobackup:dump", function(error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
    sys.print('stderr: ' + stderr);
    //console.log(stdout);
    res.jsonp(stdout);

    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

exports.system = function(req, res) {
  res.jsonp({
    hostname: os.hostname(),
    type: os.type(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    cpus: os.cpus()

  });
};

exports.dashboard = function(req, res) {

  var result = {};

  Typing.aggregate({
      $group: {
        '_id': '$resultmap',
        'count': {
          $sum: 1
        }
      }
    },
    function(err, obj) {
      if (err); // TODO handle error
      //console.log(res);
      result.hemotype = obj;

      Typing.aggregate({
          $group: {
            '_id': {
              $dayOfYear: '$created"'
            },
            'count': {
              $sum: 1
            }

          }
        },
        function(err, obj2) {
          if (err); // TODO handle error
          //console.log(res);
          result.monthly = obj2;

          User.count({}, function(err, usercount) {
            result.usercount = usercount;
            Hospital.count({}, function(err, hpcount) {
              result.hospitalcount = hpcount;
              Typing.count({}, function(err, typingcount) {
                result.hemocount = typingcount;
                User.count({
                  roles: 'curator'
                }, function(err, crcount) {
                  result.curatorcount = crcount;
                  ResultMap.find({}, function(err, resultmaps) {
                    result.resultmaps = resultmaps;
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

exports.testhisc = function(req,res) {
  // Parameters:
  var minEdge;
  var maxEdge;

  var binWidth;
  var data=new Array();
var sortObj={};
  var freq = 50;
 // var param = req.param;
 var param='typing.mcv';
 
  
  //res.jsonp(counts);
  
  sortObj[param]=-1;
  Typing.find({},'typing').sort(sortObj).limit(1).exec(function(err, max_values) {
    if (err) return next(err);
    if (!max_values) return next(new Error('Failed to load max values ' + id));
    var max_value = max_values[0].typing.mcv;
    //res.jsonp(max_value);
    console.log("max value: "+max_value);
    sortObj[param]=1;

    Typing.find({},'typing').sort(sortObj).limit(1).exec(function(err, min_values) {
    if (err) return next(err);
    if (!min_values) return next(new Error('Failed to load min values ' + id));
    var min_value = min_values[0].typing.mcv;
    console.log("min value: "+min_value);
    //res.jsonp(min_value);
    
    minEdge=min_value;
    maxEdge=max_value;
    binWidth=Math.floor((max_value - min_value) / freq);

    var numEdges = Math.abs(Math.floor((maxEdge - minEdge) / binWidth)) + 1;
	  
	  // Create a 1d edge array...
	  var edges = new Array(numEdges);
	  for (var i = 0; i < numEdges; i++) {
	    edges[i] = minEdge + i * binWidth;
	  }
	  console.log(edges);
	  // Simulate some data:
	  Typing.find({},'typing').exec(function(err, objs) {
		  	for (var i = 0; i < objs.length; i++) {
		   		data.push(objs[i].typing.mcv);
	  		}
	  		
	  		var counts = histc(data, edges);
	  		res.jsonp(counts);
		});
	 

	  // Compute the histogram:
	 // 


  
  });
  
  });
}

/*exports.normaldist2 = function(req, res) {
  var freq = 50;
  var param = req.param;
  Typing.find({}, ['typing.' + param], {
    limit: 1,
    sort: {
      'typing.' + param: -1
    }
  }).exec(function(err, max_values) {
    if (err) return next(err);
    if (!max_values) return next(new Error('Failed to load max values ' + id));
    var max_value = max_values[0];

    Typing.find({}, ['typing.' + param], {
      limit: 1,
      sort: {
        'typing.' + param: 1
      }
    }).exec(function(err, min_values) {
      if (err) return next(err);
      if (!min_values) return next(new Error('Failed to load min values ' + id));
      var min_value = min_values[0];
      var interval = Math.floor((max_value - min_value) / freq);
      Typing.aggregate({
        $project: {
          'typing.mcv': 1
        }
      }, function(err, objs) {
        for (var i = 0; i < objs.length(); i++) {
          for (var y = min_value; y < max_value; y += interval) {
            if (objs[i] >= y - interval && objs[i] <= y + interval)
          }
        }

      });

    });
  });

}*/
