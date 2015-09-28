'use strict';

angular.module('druidWebApp')
  .controller('DashboardCtrl', ['$scope', '$http', '$window', '$stateParams', 'API', function ($scope, $http, $window, $stateParams, API) {
    $scope.waiting = true;

    $scope.user = null;
    if ($window.sessionStorage.user) {
      $scope.user = JSON.parse($window.sessionStorage.user);
    }

    $scope.queues = {};
    $scope.charts = {};

    $scope.weekdays = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    var days = 4;
    var now = new Date();
    var mydays = [];
    while ( days >= 0) {
        var ago = new Date();
        ago.setDate(ago.getDate()-days);
        mydays.push($scope.weekdays[ago.getDay()]);
        days--;
    }
    $scope.weekdays = mydays;
    console.log(mydays);

    $scope.options = {
            chart: {
                type: 'lineChart',
                height: 150,
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Last 5 days',
                    tickValues: [0,1,2,3,4],
                    tickFormat: function(d) { return $scope.weekdays[d]; }
                },
                yAxis: {
                  tickValues: [0,5,10]
                },
                yDomain: [0,10]
            }
        };


    $http
      .get(API+'/queues')
      .then( function(response) {
        if (response.status === 200) {
          for (var i = 0 ; i < response.data.length ; i++ ) {
            var curr = response.data[i];
            $scope.queues[curr._id] = curr;
            $http
              .get(API+'/chart1/'+curr._id)
              .then( function(response) {
                if (response.status === 200 ) {
                  var myData = [
                    { key: 'todo', values: response.data.todo, color: 'red'},
                    { key: 'done', values: response.data.done, color: 'green'}
                  ];
                  console.log(myData);
                  $scope.charts[response.data.queue] = myData;
                }
              });
          }
        }
      });

  }]);
