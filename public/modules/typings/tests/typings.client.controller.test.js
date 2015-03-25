'use strict';

(function() {
	// Typings Controller Spec
	describe('Typings Controller Tests', function() {
		// Initialize global variables
		var TypingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Typings controller.
			TypingsController = $controller('TypingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Typing object fetched from XHR', inject(function(Typings) {
			// Create sample Typing using the Typings service
			var sampleTyping = new Typings({
				name: 'New Typing'
			});

			// Create a sample Typings array that includes the new Typing
			var sampleTypings = [sampleTyping];

			// Set GET response
			$httpBackend.expectGET('typings').respond(sampleTypings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.typings).toEqualData(sampleTypings);
		}));

		it('$scope.findOne() should create an array with one Typing object fetched from XHR using a typingId URL parameter', inject(function(Typings) {
			// Define a sample Typing object
			var sampleTyping = new Typings({
				name: 'New Typing'
			});

			// Set the URL parameter
			$stateParams.typingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/typings\/([0-9a-fA-F]{24})$/).respond(sampleTyping);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.typing).toEqualData(sampleTyping);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Typings) {
			// Create a sample Typing object
			var sampleTypingPostData = new Typings({
				name: 'New Typing'
			});

			// Create a sample Typing response
			var sampleTypingResponse = new Typings({
				_id: '525cf20451979dea2c000001',
				name: 'New Typing'
			});

			// Fixture mock form input values
			scope.name = 'New Typing';

			// Set POST response
			$httpBackend.expectPOST('typings', sampleTypingPostData).respond(sampleTypingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Typing was created
			expect($location.path()).toBe('/typings/' + sampleTypingResponse._id);
		}));

		it('$scope.update() should update a valid Typing', inject(function(Typings) {
			// Define a sample Typing put data
			var sampleTypingPutData = new Typings({
				_id: '525cf20451979dea2c000001',
				name: 'New Typing'
			});

			// Mock Typing in scope
			scope.typing = sampleTypingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/typings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/typings/' + sampleTypingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid typingId and remove the Typing from the scope', inject(function(Typings) {
			// Create new Typing object
			var sampleTyping = new Typings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Typings array and include the Typing
			scope.typings = [sampleTyping];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/typings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTyping);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.typings.length).toBe(0);
		}));
	});
}());