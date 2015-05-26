'use strict';

// Calendars controller
angular.module('calendars').controller('CalendarsController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Calendars','$filter','$sce',
	function($http,$scope, $stateParams, $location, Authentication, Calendars,filter,$sce) {
		$scope.authentication = Authentication;

		// Create new Calendar
		$scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
				timezone: 'Thailand/Bangkok',
        header:{
        //  left: 'month basicWeek basicDay agendaWeek agendaDay',
				left: 'month basicWeek basicDay ',
          center: 'title',
          right: 'today prev,next'
        },
				viewRender: function(view,ele){
					$scope.typing_events.events=[];
					$scope.upload_events.events=[];
					$scope.findOne(view,ele);
				}
				,
				eventClick: function(date,event,view){
					console.log(date);
					$location.path('typingsdate/'+date.start.getDate()+'/'+(date.start.getMonth()+1)+'/'+date.start.getFullYear());
				//	$scope.alertOnEventClick;
			},
				 eventDrop: function(date,event,view){}
				/* eventResize: $scope.alertOnResize*/
      }
    };


			var date = new Date();
    	var d = date.getDate();
    	var m = date.getMonth();
    	var y = date.getFullYear();

			$scope.typing_events = {
				color: '#16AD8F',
				textColor: 'white',
	      events:[]
	    };

			$scope.upload_events = {
				color: '#E67E22',
				textColor: 'white',
	      events:[]
	    };

			$scope.eventSources = [$scope.typing_events,$scope.upload_events];

		// Remove existing Calendar
		$scope.remove = function(calendar) {
			if ( calendar ) {
				calendar.$remove();

				for (var i in $scope.calendars) {
					if ($scope.calendars [i] === calendar) {
						$scope.calendars.splice(i, 1);
					}
				}
			} else {
				$scope.calendar.$remove(function() {
					$location.path('calendars');
				});
			}
		};

		// Update existing Calendar
		$scope.update = function() {
			var calendar = $scope.calendar;

			calendar.$update(function() {
				$location.path('calendars/' + calendar._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Calendars
		$scope.find = function() {
			$scope.calendars = Calendars.query();
		};

		// Find existing Calendar
		$scope.findOne = function(view,element){
			var today=new Date();
			//console.log(view);
//if(!month)month=today.getMonth()+1;
			//if(!year)year=today.getFullYear();
			var month=view.start.getMonth()+1;
			var year=view.start.getFullYear();

			//var uploadicon='<i class="fa fa-cloud-upload"></i> ';
			//$sce.trustAsHtml(uploadicon);

			var log = [];
			$http({
					url: 'typingcalendar/'+month+'/'+year,
					method: 'GET'
			}).success(function(data){
				console.log(data);
				if(data.typing){
					angular.forEach(data.typing, function(value, key) {
					  $scope.typing_events.events.push({title: filter('number')(value)+' profile(s) inserted',start:new Date(year,view.start.getMonth(),key),allday:true});
					}, log);
				}

				if(data.upload){
					angular.forEach(data.upload, function(value, key) {
					  $scope.upload_events.events.push({title:filter('number')(value)+' file(s) uploaded',start:new Date(year,view.start.getMonth(),key),allday:true});
					}, log);
				}
			});
			/*$scope.calendar = Calendars.get({
				calendarId: $stateParams.calendarId
			});*/
		};
	}
]);
