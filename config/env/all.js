'use strict';

module.exports = {
	app: {
		title: 'Thal Interpretor',
		description: 'Thalasemia Interpretation software',
		keywords: 'Thalassemia, typing, bioinformatics'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/fontawesome/css/font-awesome.min.css',
				'public/lib/morrisjs/morris.css',
				'public/lib/sweetalert/lib/sweet-alert.css',
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-route/angular-route.min.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/ng-file-upload/angular-file-upload-shim.min.js',
				'public/lib/ng-file-upload/angular-file-upload.min.js',
				'public/lib/sweetalert/lib/sweet-alert.min.js',
				'public/lib/angular-sweetalert/SweetAlert.min.js',
				'public/lib/angular-smart-table/dist/smart-table.min.js'

			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/ext/**/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js',
			'public/ext/**/*.js',
			'public/js/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
