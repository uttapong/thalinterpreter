'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Calendar = mongoose.model('Calendar'),
	session=require('supertest-session')({app:app}),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, calendar;

/**
 * Calendar routes tests
 */
describe('Calendar CRUD tests', function() {



	beforeEach(function(done) {
		// Create user credentials


		credentials = {
			username: 'uttapong',
			password: 'serenoss'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Calendar
		user.save(function() {
			calendar = {
				name: 'Calendar Name'
			};

			done();
		});
	});
var sess = new session();
	it('should be able to save Calendar instance if logged in', function(done) {

		sess.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);
			//	console.log(signinRes);
				// Get the userId
				var userId = user.id;

				// Save a new Calendar
				sess.post('/calendars')
					.send(calendar)
					.expect(200)
					.end(function(calendarSaveErr, calendarSaveRes) {
						// Handle Calendar save error
						console.log(userId);

						if (calendarSaveErr) done(calendarSaveErr);

						// Get a list of Calendars
						sess.get('/calendars')
							.end(function(calendarsGetErr, calendarsGetRes) {
								// Handle Calendar save error
								if (calendarsGetErr) done(calendarsGetErr);

								// Get Calendars list
								var calendars = calendarsGetRes.body;

								// Set assertions
								(calendars[0].user._id).should.equal('54e1b64bdc572445fbe6e105');
								(calendars[0].name).should.match('Calendar Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Calendar instance if not logged in', function(done) {
		sess.post('/calendars')
			.send(calendar)
			.expect(401)
			.end(function(calendarSaveErr, calendarSaveRes) {
				// Call the assertion callback
				done(calendarSaveErr);
			});
	});

	it('should not be able to save Calendar instance if no name is provided', function(done) {
		// Invalidate name field
		calendar.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;
				console.log(userId);
				// Save a new Calendar
				agent.post('/calendars')
					.send(calendar)
					.expect(400)
					.end(function(calendarSaveErr, calendarSaveRes) {
						// Set message assertion
						(calendarSaveRes.body.message).should.match('Please fill Calendar name');

						// Handle Calendar save error
						done(calendarSaveErr);
					});
			});
	});

	it('should be able to update Calendar instance if signed in', function(done) {
		sess.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendar
				sess.post('/calendars')
					.send(calendar)
					.expect(200)
					.end(function(calendarSaveErr, calendarSaveRes) {
						// Handle Calendar save error
						if (calendarSaveErr) done(calendarSaveErr);

						// Update Calendar name
						calendar.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Calendar
						sess.put('/calendars/' + calendarSaveRes.body._id)
							.send(calendar)
							.expect(200)
							.end(function(calendarUpdateErr, calendarUpdateRes) {
								// Handle Calendar update error
								if (calendarUpdateErr) done(calendarUpdateErr);

								// Set assertions
								(calendarUpdateRes.body._id).should.equal(calendarSaveRes.body._id);
								(calendarUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Calendars if not signed in', function(done) {
		// Create new Calendar model instance
		var calendarObj = new Calendar(calendar);

		// Save the Calendar
		calendarObj.save(function() {
			// Request Calendars
			request(app).get('/calendars')
				.end(function(req, res) {
					// Set assertion
					res.body.should.have.properties('message');

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Calendar if not signed in', function(done) {
		// Create new Calendar model instance
		var calendarObj = new Calendar(calendar);

		// Save the Calendar
		calendarObj.save(function() {
			request(app).get('/calendars/' + calendarObj._id)
				.end(function(req, res) {
					// Set assertion
					console.log(res.body);
					res.body.should.be.an.Object.with.property('name', calendar.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Calendar instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Calendar
				agent.post('/calendars')
					.send(calendar)
					.expect(200)
					.end(function(calendarSaveErr, calendarSaveRes) {
						// Handle Calendar save error
						if (calendarSaveErr) done(calendarSaveErr);

						// Delete existing Calendar
						agent.delete('/calendars/' + calendarSaveRes.body._id)
							.send(calendar)
							.expect(200)
							.end(function(calendarDeleteErr, calendarDeleteRes) {
								// Handle Calendar error error
								if (calendarDeleteErr) done(calendarDeleteErr);

								// Set assertions
								(calendarDeleteRes.body._id).should.equal(calendarSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Calendar instance if not signed in', function(done) {
		// Set Calendar user
		calendar.user = user;

		// Create new Calendar model instance
		var calendarObj = new Calendar(calendar);

		// Save the Calendar
		calendarObj.save(function() {
			// Try deleting Calendar
			request(app).delete('/calendars/' + calendarObj._id)
			.expect(401)
			.end(function(calendarDeleteErr, calendarDeleteRes) {
				// Set message assertion
				(calendarDeleteRes.body.message).should.match('User is not logged in');

				// Handle Calendar error error
				done(calendarDeleteErr);
			});

		});
	});

	afterEach(function(done) {
	//	User.remove().exec();
	//	Calendar.remove().exec();
	sess.destroy();
		done();

	});
});
