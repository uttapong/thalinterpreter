'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Typing = mongoose.model('Typing'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, typing;

/**
 * Typing routes tests
 */
describe('Typing CRUD tests', function() {
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

		// Save a user to the test db and create new Typing
		user.save(function() {
			typing = {
				name: 'Typing Name'
			};

			done();
		});
	});

	it('should be able to save Typing instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Typing
				agent.post('/typings')
					.send(typing)
					.expect(200)
					.end(function(typingSaveErr, typingSaveRes) {
						// Handle Typing save error
						if (typingSaveErr) done(typingSaveErr);

						// Get a list of Typings
						agent.get('/typings')
							.end(function(typingsGetErr, typingsGetRes) {
								// Handle Typing save error
								if (typingsGetErr) done(typingsGetErr);

								// Get Typings list
								var typings = typingsGetRes.body;

								// Set assertions
								(typings[0].user._id).should.equal(userId);
								(typings[0].name).should.match('Typing Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Typing instance if not logged in', function(done) {
		agent.post('/typings')
			.send(typing)
			.expect(401)
			.end(function(typingSaveErr, typingSaveRes) {
				// Call the assertion callback
				done(typingSaveErr);
			});
	});

	it('should not be able to save Typing instance if no name is provided', function(done) {
		// Invalidate name field
		typing.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Typing
				agent.post('/typings')
					.send(typing)
					.expect(400)
					.end(function(typingSaveErr, typingSaveRes) {
						// Set message assertion
						(typingSaveRes.body.message).should.match('Please fill Typing name');
						
						// Handle Typing save error
						done(typingSaveErr);
					});
			});
	});

	it('should be able to update Typing instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Typing
				agent.post('/typings')
					.send(typing)
					.expect(200)
					.end(function(typingSaveErr, typingSaveRes) {
						// Handle Typing save error
						if (typingSaveErr) done(typingSaveErr);

						// Update Typing name
						typing.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Typing
						agent.put('/typings/' + typingSaveRes.body._id)
							.send(typing)
							.expect(200)
							.end(function(typingUpdateErr, typingUpdateRes) {
								// Handle Typing update error
								if (typingUpdateErr) done(typingUpdateErr);

								// Set assertions
								(typingUpdateRes.body._id).should.equal(typingSaveRes.body._id);
								(typingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Typings if not signed in', function(done) {
		// Create new Typing model instance
		var typingObj = new Typing(typing);

		// Save the Typing
		typingObj.save(function() {
			// Request Typings
			request(app).get('/typings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Typing if not signed in', function(done) {
		// Create new Typing model instance
		var typingObj = new Typing(typing);

		// Save the Typing
		typingObj.save(function() {
			request(app).get('/typings/' + typingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', typing.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Typing instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Typing
				agent.post('/typings')
					.send(typing)
					.expect(200)
					.end(function(typingSaveErr, typingSaveRes) {
						// Handle Typing save error
						if (typingSaveErr) done(typingSaveErr);

						// Delete existing Typing
						agent.delete('/typings/' + typingSaveRes.body._id)
							.send(typing)
							.expect(200)
							.end(function(typingDeleteErr, typingDeleteRes) {
								// Handle Typing error error
								if (typingDeleteErr) done(typingDeleteErr);

								// Set assertions
								(typingDeleteRes.body._id).should.equal(typingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Typing instance if not signed in', function(done) {
		// Set Typing user 
		typing.user = user;

		// Create new Typing model instance
		var typingObj = new Typing(typing);

		// Save the Typing
		typingObj.save(function() {
			// Try deleting Typing
			request(app).delete('/typings/' + typingObj._id)
			.expect(401)
			.end(function(typingDeleteErr, typingDeleteRes) {
				// Set message assertion
				(typingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Typing error error
				done(typingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Typing.remove().exec();
		done();
	});
});