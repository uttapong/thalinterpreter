'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Resultmap = mongoose.model('Resultmap'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, resultmap;

/**
 * Resultmap routes tests
 */
describe('Resultmap CRUD tests', function() {
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

		// Save a user to the test db and create new Resultmap
		user.save(function() {
			resultmap = {
				name: 'Resultmap Name'
			};

			done();
		});
	});

	it('should be able to save Resultmap instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resultmap
				agent.post('/resultmaps')
					.send(resultmap)
					.expect(200)
					.end(function(resultmapSaveErr, resultmapSaveRes) {
						// Handle Resultmap save error
						if (resultmapSaveErr) done(resultmapSaveErr);

						// Get a list of Resultmaps
						agent.get('/resultmaps')
							.end(function(resultmapsGetErr, resultmapsGetRes) {
								// Handle Resultmap save error
								if (resultmapsGetErr) done(resultmapsGetErr);

								// Get Resultmaps list
								var resultmaps = resultmapsGetRes.body;

								// Set assertions
								(resultmaps[0].user._id).should.equal(userId);
								(resultmaps[0].name).should.match('Resultmap Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Resultmap instance if not logged in', function(done) {
		agent.post('/resultmaps')
			.send(resultmap)
			.expect(401)
			.end(function(resultmapSaveErr, resultmapSaveRes) {
				// Call the assertion callback
				done(resultmapSaveErr);
			});
	});

	it('should not be able to save Resultmap instance if no name is provided', function(done) {
		// Invalidate name field
		resultmap.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resultmap
				agent.post('/resultmaps')
					.send(resultmap)
					.expect(400)
					.end(function(resultmapSaveErr, resultmapSaveRes) {
						// Set message assertion
						(resultmapSaveRes.body.message).should.match('Please fill Resultmap name');
						
						// Handle Resultmap save error
						done(resultmapSaveErr);
					});
			});
	});

	it('should be able to update Resultmap instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resultmap
				agent.post('/resultmaps')
					.send(resultmap)
					.expect(200)
					.end(function(resultmapSaveErr, resultmapSaveRes) {
						// Handle Resultmap save error
						if (resultmapSaveErr) done(resultmapSaveErr);

						// Update Resultmap name
						resultmap.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Resultmap
						agent.put('/resultmaps/' + resultmapSaveRes.body._id)
							.send(resultmap)
							.expect(200)
							.end(function(resultmapUpdateErr, resultmapUpdateRes) {
								// Handle Resultmap update error
								if (resultmapUpdateErr) done(resultmapUpdateErr);

								// Set assertions
								(resultmapUpdateRes.body._id).should.equal(resultmapSaveRes.body._id);
								(resultmapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Resultmaps if not signed in', function(done) {
		// Create new Resultmap model instance
		var resultmapObj = new Resultmap(resultmap);

		// Save the Resultmap
		resultmapObj.save(function() {
			// Request Resultmaps
			request(app).get('/resultmaps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Resultmap if not signed in', function(done) {
		// Create new Resultmap model instance
		var resultmapObj = new Resultmap(resultmap);

		// Save the Resultmap
		resultmapObj.save(function() {
			request(app).get('/resultmaps/' + resultmapObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', resultmap.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Resultmap instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Resultmap
				agent.post('/resultmaps')
					.send(resultmap)
					.expect(200)
					.end(function(resultmapSaveErr, resultmapSaveRes) {
						// Handle Resultmap save error
						if (resultmapSaveErr) done(resultmapSaveErr);

						// Delete existing Resultmap
						agent.delete('/resultmaps/' + resultmapSaveRes.body._id)
							.send(resultmap)
							.expect(200)
							.end(function(resultmapDeleteErr, resultmapDeleteRes) {
								// Handle Resultmap error error
								if (resultmapDeleteErr) done(resultmapDeleteErr);

								// Set assertions
								(resultmapDeleteRes.body._id).should.equal(resultmapSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Resultmap instance if not signed in', function(done) {
		// Set Resultmap user 
		resultmap.user = user;

		// Create new Resultmap model instance
		var resultmapObj = new Resultmap(resultmap);

		// Save the Resultmap
		resultmapObj.save(function() {
			// Try deleting Resultmap
			request(app).delete('/resultmaps/' + resultmapObj._id)
			.expect(401)
			.end(function(resultmapDeleteErr, resultmapDeleteRes) {
				// Set message assertion
				(resultmapDeleteRes.body.message).should.match('User is not logged in');

				// Handle Resultmap error error
				done(resultmapDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Resultmap.remove().exec();
		done();
	});
});