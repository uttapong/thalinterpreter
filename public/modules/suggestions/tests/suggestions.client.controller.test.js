'use strict';

(function() {
	// Suggestions Controller Spec
	describe('Suggestions Controller Tests', function() {
		// Initialize global variables
		var SuggestionsController,
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

			// Initialize the Suggestions controller.
			SuggestionsController = $controller('SuggestionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Suggestion object fetched from XHR', inject(function(Suggestions) {
			// Create sample Suggestion using the Suggestions service
			var sampleSuggestion = new Suggestions({
				name: 'New Suggestion'
			});

			// Create a sample Suggestions array that includes the new Suggestion
			var sampleSuggestions = [sampleSuggestion];

			// Set GET response
			$httpBackend.expectGET('suggestions').respond(sampleSuggestions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.suggestions).toEqualData(sampleSuggestions);
		}));

		it('$scope.findOne() should create an array with one Suggestion object fetched from XHR using a suggestionId URL parameter', inject(function(Suggestions) {
			// Define a sample Suggestion object
			var sampleSuggestion = new Suggestions({
				name: 'New Suggestion'
			});

			// Set the URL parameter
			$stateParams.suggestionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/suggestions\/([0-9a-fA-F]{24})$/).respond(sampleSuggestion);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.suggestion).toEqualData(sampleSuggestion);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Suggestions) {
			// Create a sample Suggestion object
			var sampleSuggestionPostData = new Suggestions({
				name: 'New Suggestion'
			});

			// Create a sample Suggestion response
			var sampleSuggestionResponse = new Suggestions({
				_id: '525cf20451979dea2c000001',
				name: 'New Suggestion'
			});

			// Fixture mock form input values
			scope.name = 'New Suggestion';

			// Set POST response
			$httpBackend.expectPOST('suggestions', sampleSuggestionPostData).respond(sampleSuggestionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Suggestion was created
			expect($location.path()).toBe('/suggestions/' + sampleSuggestionResponse._id);
		}));

		it('$scope.update() should update a valid Suggestion', inject(function(Suggestions) {
			// Define a sample Suggestion put data
			var sampleSuggestionPutData = new Suggestions({
				_id: '525cf20451979dea2c000001',
				name: 'New Suggestion'
			});

			// Mock Suggestion in scope
			scope.suggestion = sampleSuggestionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/suggestions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/suggestions/' + sampleSuggestionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid suggestionId and remove the Suggestion from the scope', inject(function(Suggestions) {
			// Create new Suggestion object
			var sampleSuggestion = new Suggestions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Suggestions array and include the Suggestion
			scope.suggestions = [sampleSuggestion];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/suggestions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSuggestion);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.suggestions.length).toBe(0);
		}));
	});
}());