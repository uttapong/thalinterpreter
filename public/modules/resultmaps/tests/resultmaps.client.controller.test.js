'use strict';

(function() {
	// Resultmaps Controller Spec
	describe('Resultmaps Controller Tests', function() {
		// Initialize global variables
		var ResultmapsController,
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

			// Initialize the Resultmaps controller.
			ResultmapsController = $controller('ResultmapsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Resultmap object fetched from XHR', inject(function(Resultmaps) {
			// Create sample Resultmap using the Resultmaps service
			var sampleResultmap = new Resultmaps({
				name: 'New Resultmap'
			});

			// Create a sample Resultmaps array that includes the new Resultmap
			var sampleResultmaps = [sampleResultmap];

			// Set GET response
			$httpBackend.expectGET('resultmaps').respond(sampleResultmaps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.resultmaps).toEqualData(sampleResultmaps);
		}));

		it('$scope.findOne() should create an array with one Resultmap object fetched from XHR using a resultmapId URL parameter', inject(function(Resultmaps) {
			// Define a sample Resultmap object
			var sampleResultmap = new Resultmaps({
				name: 'New Resultmap'
			});

			// Set the URL parameter
			$stateParams.resultmapId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/resultmaps\/([0-9a-fA-F]{24})$/).respond(sampleResultmap);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.resultmap).toEqualData(sampleResultmap);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Resultmaps) {
			// Create a sample Resultmap object
			var sampleResultmapPostData = new Resultmaps({
				name: 'New Resultmap'
			});

			// Create a sample Resultmap response
			var sampleResultmapResponse = new Resultmaps({
				_id: '525cf20451979dea2c000001',
				name: 'New Resultmap'
			});

			// Fixture mock form input values
			scope.name = 'New Resultmap';

			// Set POST response
			$httpBackend.expectPOST('resultmaps', sampleResultmapPostData).respond(sampleResultmapResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Resultmap was created
			expect($location.path()).toBe('/resultmaps/' + sampleResultmapResponse._id);
		}));

		it('$scope.update() should update a valid Resultmap', inject(function(Resultmaps) {
			// Define a sample Resultmap put data
			var sampleResultmapPutData = new Resultmaps({
				_id: '525cf20451979dea2c000001',
				name: 'New Resultmap'
			});

			// Mock Resultmap in scope
			scope.resultmap = sampleResultmapPutData;

			// Set PUT response
			$httpBackend.expectPUT(/resultmaps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/resultmaps/' + sampleResultmapPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid resultmapId and remove the Resultmap from the scope', inject(function(Resultmaps) {
			// Create new Resultmap object
			var sampleResultmap = new Resultmaps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Resultmaps array and include the Resultmap
			scope.resultmaps = [sampleResultmap];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/resultmaps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleResultmap);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.resultmaps.length).toBe(0);
		}));
	});
}());