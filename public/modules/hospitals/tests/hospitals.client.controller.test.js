'use strict';

(function() {
	// Hospitals Controller Spec
	describe('Hospitals Controller Tests', function() {
		// Initialize global variables
		var HospitalsController,
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

			// Initialize the Hospitals controller.
			HospitalsController = $controller('HospitalsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hospital object fetched from XHR', inject(function(Hospitals) {
			// Create sample Hospital using the Hospitals service
			var sampleHospital = new Hospitals({
				name: 'New Hospital'
			});

			// Create a sample Hospitals array that includes the new Hospital
			var sampleHospitals = [sampleHospital];

			// Set GET response
			$httpBackend.expectGET('hospitals').respond(sampleHospitals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hospitals).toEqualData(sampleHospitals);
		}));

		it('$scope.findOne() should create an array with one Hospital object fetched from XHR using a hospitalId URL parameter', inject(function(Hospitals) {
			// Define a sample Hospital object
			var sampleHospital = new Hospitals({
				name: 'New Hospital'
			});

			// Set the URL parameter
			$stateParams.hospitalId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hospitals\/([0-9a-fA-F]{24})$/).respond(sampleHospital);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hospital).toEqualData(sampleHospital);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Hospitals) {
			// Create a sample Hospital object
			var sampleHospitalPostData = new Hospitals({
				name: 'New Hospital'
			});

			// Create a sample Hospital response
			var sampleHospitalResponse = new Hospitals({
				_id: '525cf20451979dea2c000001',
				name: 'New Hospital'
			});

			// Fixture mock form input values
			scope.name = 'New Hospital';

			// Set POST response
			$httpBackend.expectPOST('hospitals', sampleHospitalPostData).respond(sampleHospitalResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hospital was created
			expect($location.path()).toBe('/hospitals/' + sampleHospitalResponse._id);
		}));

		it('$scope.update() should update a valid Hospital', inject(function(Hospitals) {
			// Define a sample Hospital put data
			var sampleHospitalPutData = new Hospitals({
				_id: '525cf20451979dea2c000001',
				name: 'New Hospital'
			});

			// Mock Hospital in scope
			scope.hospital = sampleHospitalPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hospitals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hospitals/' + sampleHospitalPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hospitalId and remove the Hospital from the scope', inject(function(Hospitals) {
			// Create new Hospital object
			var sampleHospital = new Hospitals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hospitals array and include the Hospital
			scope.hospitals = [sampleHospital];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hospitals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHospital);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hospitals.length).toBe(0);
		}));
	});
}());