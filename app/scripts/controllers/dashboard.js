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
    $scope.options = {};
    $scope.labels = undefined;

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
                  console.log(response.data);
                  var myData = [
                    { key: 'todo', values: response.data.todo, color: 'red'},
                    { key: 'done', values: response.data.done, color: 'green'}
                  ];
                  if ($scope.labels === undefined) {
                    var mylabels = new Array();
                    for (var j = 0 ; j < response.data.todo.length ; j++ ) {
                      mylabels.push(response.data.todo[j].label);
                    }
                    $scope.labels = mylabels;
                  }
                  $scope.options[response.data.queue] = {
                    chart: {
                        type: 'lineChart',
                        height: 150,
                        x: function(d){ return d.x; },
                        y: function(d){ return d.y; },
                        useInteractiveGuideline: true,
                        xAxis: {
                            axisLabel: 'Last 5 days',
                            tickValues: [0,1,2,3,4],
                            tickFormat: function(d) { return $scope.labels[d]; }
                        },
                        yDomain: [0, response.data.max]
                    }
                  };
                  $scope.charts[response.data.queue] = myData;
                }
              });
          }
        }
      });

  }]);
