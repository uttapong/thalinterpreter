'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'thal';
	var applicationModuleVendorDependencies = [
	'ngResource',
	'ngCookies',
	'ngRoute',
	'ngTouch',
	'ngSanitize',
	'ui.router',
	'ui.bootstrap',
	'ui.utils',
	'angularFileUpload',
	'oitozero.ngSweetAlert',
	'ui.bootstrap',
	'smart-table',
	'angular-loading-bar',
	'pascalprecht.translate',
	'chart.js'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);
		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};


})();


angular.module('oitozero.ngSweetAlert', [])
.factory('SweetAlert', [ function ( ) {

	var swal = window.swal;

	//public methods
	var self = {

		swal: function ( arg1, arg2, arg3 ) {
			swal( arg1, arg2, arg3 );
		},
		success: function(title, message) {
			swal( title, message, 'success' );
		},
		error: function(title, message) {
			swal( title, message, 'error' );
		},
		warning: function(title, message) {
			swal( title, message, 'warning' );
		},
		info: function(title, message) {
			swal( title, message, 'info' );
		}
	};

	return self;
}]);
