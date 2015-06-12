'use strict';

(function() {
	// Rbcs Controller Spec
	describe('Rbcs Controller Tests', function() {
		// Initialize global variables
		var RbcsController,
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

			// Initialize the Rbcs controller.
			RbcsController = $controller('RbcsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rbc object fetched from XHR', inject(function(Rbcs) {
			// Create sample Rbc using the Rbcs service
			var sampleRbc = new Rbcs({
				name: 'New Rbc'
			});

			// Create a sample Rbcs array that includes the new Rbc
			var sampleRbcs = [sampleRbc];

			// Set GET response
			$httpBackend.expectGET('rbcs').respond(sampleRbcs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rbcs).toEqualData(sampleRbcs);
		}));

		it('$scope.findOne() should create an array with one Rbc object fetched from XHR using a rbcId URL parameter', inject(function(Rbcs) {
			// Define a sample Rbc object
			var sampleRbc = new Rbcs({
				name: 'New Rbc'
			});

			// Set the URL parameter
			$stateParams.rbcId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rbcs\/([0-9a-fA-F]{24})$/).respond(sampleRbc);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rbc).toEqualData(sampleRbc);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rbcs) {
			// Create a sample Rbc object
			var sampleRbcPostData = new Rbcs({
				name: 'New Rbc'
			});

			// Create a sample Rbc response
			var sampleRbcResponse = new Rbcs({
				_id: '525cf20451979dea2c000001',
				name: 'New Rbc'
			});

			// Fixture mock form input values
			scope.name = 'New Rbc';

			// Set POST response
			$httpBackend.expectPOST('rbcs', sampleRbcPostData).respond(sampleRbcResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rbc was created
			expect($location.path()).toBe('/rbcs/' + sampleRbcResponse._id);
		}));

		it('$scope.update() should update a valid Rbc', inject(function(Rbcs) {
			// Define a sample Rbc put data
			var sampleRbcPutData = new Rbcs({
				_id: '525cf20451979dea2c000001',
				name: 'New Rbc'
			});

			// Mock Rbc in scope
			scope.rbc = sampleRbcPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rbcs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rbcs/' + sampleRbcPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rbcId and remove the Rbc from the scope', inject(function(Rbcs) {
			// Create new Rbc object
			var sampleRbc = new Rbcs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rbcs array and include the Rbc
			scope.rbcs = [sampleRbc];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rbcs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRbc);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rbcs.length).toBe(0);
		}));
	});
}());