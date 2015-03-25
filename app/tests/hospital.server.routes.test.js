'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Hospital = mongoose.model('Hospital'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hospital;

/**
 * Hospital routes tests
 */
describe('Hospital CRUD tests', function() {
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

		// Save a user to the test db and create new Hospital
		user.save(function() {
			hospital = {
				name: 'Hospital Name'
			};

			done();
		});
	});

	it('should be able to save Hospital instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hospital
				agent.post('/hospitals')
					.send(hospital)
					.expect(200)
					.end(function(hospitalSaveErr, hospitalSaveRes) {
						// Handle Hospital save error
						if (hospitalSaveErr) done(hospitalSaveErr);

						// Get a list of Hospitals
						agent.get('/hospitals')
							.end(function(hospitalsGetErr, hospitalsGetRes) {
								// Handle Hospital save error
								if (hospitalsGetErr) done(hospitalsGetErr);

								// Get Hospitals list
								var hospitals = hospitalsGetRes.body;

								// Set assertions
								(hospitals[0].user._id).should.equal(userId);
								(hospitals[0].name).should.match('Hospital Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hospital instance if not logged in', function(done) {
		agent.post('/hospitals')
			.send(hospital)
			.expect(401)
			.end(function(hospitalSaveErr, hospitalSaveRes) {
				// Call the assertion callback
				done(hospitalSaveErr);
			});
	});

	it('should not be able to save Hospital instance if no name is provided', function(done) {
		// Invalidate name field
		hospital.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hospital
				agent.post('/hospitals')
					.send(hospital)
					.expect(400)
					.end(function(hospitalSaveErr, hospitalSaveRes) {
						// Set message assertion
						(hospitalSaveRes.body.message).should.match('Please fill Hospital name');
						
						// Handle Hospital save error
						done(hospitalSaveErr);
					});
			});
	});

	it('should be able to update Hospital instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hospital
				agent.post('/hospitals')
					.send(hospital)
					.expect(200)
					.end(function(hospitalSaveErr, hospitalSaveRes) {
						// Handle Hospital save error
						if (hospitalSaveErr) done(hospitalSaveErr);

						// Update Hospital name
						hospital.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hospital
						agent.put('/hospitals/' + hospitalSaveRes.body._id)
							.send(hospital)
							.expect(200)
							.end(function(hospitalUpdateErr, hospitalUpdateRes) {
								// Handle Hospital update error
								if (hospitalUpdateErr) done(hospitalUpdateErr);

								// Set assertions
								(hospitalUpdateRes.body._id).should.equal(hospitalSaveRes.body._id);
								(hospitalUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hospitals if not signed in', function(done) {
		// Create new Hospital model instance
		var hospitalObj = new Hospital(hospital);

		// Save the Hospital
		hospitalObj.save(function() {
			// Request Hospitals
			request(app).get('/hospitals')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hospital if not signed in', function(done) {
		// Create new Hospital model instance
		var hospitalObj = new Hospital(hospital);

		// Save the Hospital
		hospitalObj.save(function() {
			request(app).get('/hospitals/' + hospitalObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hospital.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hospital instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hospital
				agent.post('/hospitals')
					.send(hospital)
					.expect(200)
					.end(function(hospitalSaveErr, hospitalSaveRes) {
						// Handle Hospital save error
						if (hospitalSaveErr) done(hospitalSaveErr);

						// Delete existing Hospital
						agent.delete('/hospitals/' + hospitalSaveRes.body._id)
							.send(hospital)
							.expect(200)
							.end(function(hospitalDeleteErr, hospitalDeleteRes) {
								// Handle Hospital error error
								if (hospitalDeleteErr) done(hospitalDeleteErr);

								// Set assertions
								(hospitalDeleteRes.body._id).should.equal(hospitalSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hospital instance if not signed in', function(done) {
		// Set Hospital user 
		hospital.user = user;

		// Create new Hospital model instance
		var hospitalObj = new Hospital(hospital);

		// Save the Hospital
		hospitalObj.save(function() {
			// Try deleting Hospital
			request(app).delete('/hospitals/' + hospitalObj._id)
			.expect(401)
			.end(function(hospitalDeleteErr, hospitalDeleteRes) {
				// Set message assertion
				(hospitalDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hospital error error
				done(hospitalDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Hospital.remove().exec();
		done();
	});
});