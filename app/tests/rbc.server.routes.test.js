'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rbc = mongoose.model('Rbc'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, rbc;

/**
 * Rbc routes tests
 */
describe('Rbc CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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

		// Save a user to the test db and create new Rbc
		user.save(function() {
			rbc = {
				name: 'Rbc Name'
			};

			done();
		});
	});

	it('should be able to save Rbc instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rbc
				agent.post('/rbcs')
					.send(rbc)
					.expect(200)
					.end(function(rbcSaveErr, rbcSaveRes) {
						// Handle Rbc save error
						if (rbcSaveErr) done(rbcSaveErr);

						// Get a list of Rbcs
						agent.get('/rbcs')
							.end(function(rbcsGetErr, rbcsGetRes) {
								// Handle Rbc save error
								if (rbcsGetErr) done(rbcsGetErr);

								// Get Rbcs list
								var rbcs = rbcsGetRes.body;

								// Set assertions
								(rbcs[0].user._id).should.equal(userId);
								(rbcs[0].name).should.match('Rbc Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rbc instance if not logged in', function(done) {
		agent.post('/rbcs')
			.send(rbc)
			.expect(401)
			.end(function(rbcSaveErr, rbcSaveRes) {
				// Call the assertion callback
				done(rbcSaveErr);
			});
	});

	it('should not be able to save Rbc instance if no name is provided', function(done) {
		// Invalidate name field
		rbc.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rbc
				agent.post('/rbcs')
					.send(rbc)
					.expect(400)
					.end(function(rbcSaveErr, rbcSaveRes) {
						// Set message assertion
						(rbcSaveRes.body.message).should.match('Please fill Rbc name');
						
						// Handle Rbc save error
						done(rbcSaveErr);
					});
			});
	});

	it('should be able to update Rbc instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rbc
				agent.post('/rbcs')
					.send(rbc)
					.expect(200)
					.end(function(rbcSaveErr, rbcSaveRes) {
						// Handle Rbc save error
						if (rbcSaveErr) done(rbcSaveErr);

						// Update Rbc name
						rbc.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rbc
						agent.put('/rbcs/' + rbcSaveRes.body._id)
							.send(rbc)
							.expect(200)
							.end(function(rbcUpdateErr, rbcUpdateRes) {
								// Handle Rbc update error
								if (rbcUpdateErr) done(rbcUpdateErr);

								// Set assertions
								(rbcUpdateRes.body._id).should.equal(rbcSaveRes.body._id);
								(rbcUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rbcs if not signed in', function(done) {
		// Create new Rbc model instance
		var rbcObj = new Rbc(rbc);

		// Save the Rbc
		rbcObj.save(function() {
			// Request Rbcs
			request(app).get('/rbcs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rbc if not signed in', function(done) {
		// Create new Rbc model instance
		var rbcObj = new Rbc(rbc);

		// Save the Rbc
		rbcObj.save(function() {
			request(app).get('/rbcs/' + rbcObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rbc.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rbc instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rbc
				agent.post('/rbcs')
					.send(rbc)
					.expect(200)
					.end(function(rbcSaveErr, rbcSaveRes) {
						// Handle Rbc save error
						if (rbcSaveErr) done(rbcSaveErr);

						// Delete existing Rbc
						agent.delete('/rbcs/' + rbcSaveRes.body._id)
							.send(rbc)
							.expect(200)
							.end(function(rbcDeleteErr, rbcDeleteRes) {
								// Handle Rbc error error
								if (rbcDeleteErr) done(rbcDeleteErr);

								// Set assertions
								(rbcDeleteRes.body._id).should.equal(rbcSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rbc instance if not signed in', function(done) {
		// Set Rbc user 
		rbc.user = user;

		// Create new Rbc model instance
		var rbcObj = new Rbc(rbc);

		// Save the Rbc
		rbcObj.save(function() {
			// Try deleting Rbc
			request(app).delete('/rbcs/' + rbcObj._id)
			.expect(401)
			.end(function(rbcDeleteErr, rbcDeleteRes) {
				// Set message assertion
				(rbcDeleteRes.body.message).should.match('User is not logged in');

				// Handle Rbc error error
				done(rbcDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Rbc.remove().exec();
		done();
	});
});