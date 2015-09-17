'use strict';

angular.module('druidWebApp')
  .controller('TasksCtrl', ['$scope', '$http', '$window', '$stateParams', 'API', function ($scope, $http, $window, $stateParams, API) {
    $scope.waiting = true;

    $scope.user = null;
    if ($window.sessionStorage.user) {
      $scope.user = JSON.parse($window.sessionStorage.user);
    }

    $scope.opts = { };
    $scope.tDone = 2;
    $scope.tTotal = 5;

    $scope.toogleOpt = function(idx) {
      $scope.opts[idx] = !$scope.opts[idx];
    }

    $scope.updateMe = function() {
      $scope.queue = null;
      $scope.tasks = null;
      $scope.waiting = true;
      $scope.edit = { };
      $scope.showAddTask = false;

      // FIXME -- no graph here just yet
      // var days = 4;
      // var now = new Date();
      // var mydays = [];
      // while ( days >= 0) {
      //     var ago = new Date();
      //     ago.setDate(ago.getDate()-days);
      //     mydays.push(ago.getDay());
      //     days--;
      // }
      // $scope.weekdays = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
      // $scope.options = {
      //         chart: {
      //             type: 'lineChart',
      //             height: 150,
      //             x: function(d){ return d.x; },
      //             y: function(d){ return d.y; },
      //             useInteractiveGuideline: true,
      //             xAxis: {
      //                 axisLabel: 'Last 5 days',
      //                 tickValues: mydays,
      //                 tickFormat: function(d) { return $scope.weekdays[d]; }
      //             },
      //             yAxis: {
      //               tickValues: [0,5,10]
      //             },
      //             yDomain: [0,10]
      //         }
      //     };

      $http
        .get(API+'/queues/'+$stateParams.id)
        .then( function(response) {
          if (response.status === 200) { $scope.queue = response.data; }
          $http
            .get(API+'/tasks/'+$stateParams.id)
            .then( function(response) {
              if (response.status === 200) {
                $scope.tasks = response.data;
                $scope.waiting = false;
                // FIXME -- no graph here just yet
                // $http
                //   .get(API+'/chart1/'+$stateParams.id)
                //   .then( function(response) {
                //     if (response.status === 200) {
                //       var myData = [
                //         { key: 'todo', values: response.data.todo, color: 'red'},
                //         { key: 'done', values: response.data.done, color: 'green'}
                //       ];
                //       $scope.chart = myData;
                //     }
                //   });
              }
            });
        });
    }
    $scope.toogleAddTask = function() {
      $scope.showAddTask = !$scope.showAddTask;
    };

    $scope.taskAdd = function() {
      $scope.edit.order = $scope.tasks ? $scope.tasks.length : 0;
      $http
        .post(API+'/tasks/'+$scope.queue._id, { text: $scope.edit.text, order: $scope.edit.order, queue: $scope.queue._id })
        .then( function(response) {
          if (response.status === 200) { $scope.updateMe(); }
        });
    };

    $scope.taskDel = function(id) {
      $scope.waiting = true;
      $http
        .delete(API+'/task/'+id)
        .then( function(response) {
          if ( response.status === 200 ) { $scope.updateMe(); }
          else { alert(response.data.message); }
        });
    };

    $scope.taskDone = function(id) {
      $scope.waiting = true;
      var now = new Date();
      $http
        .put(API+'/task/'+id, { done: true, partial: 100, completed: now })
        .then( function(response) {
          if ( response.status === 200 ) { $scope.updateMe(); }
          else { alert(response.data.message); }
        });
    };

    $scope.taskUndo = function(id) {
      $scope.waiting = true;
      $http
        .put(API+'/task/'+id, { done: false, partial: 0, completed: '' })
        .then( function(response) {
          if ( response.status === 200 ) { $scope.updateMe(); }
          else { alert(response.data.message); }
        });
    };

    $scope.reorder = function(id1, pos, id2) {
      $scope.waiting = true;
      $http
        .get(API+'/reorder/'+id1+'/'+pos+'/'+id2)
        .then( function(response) {
          if ( response.status === 200 ) { $scope.updateMe(); }
          else { alert(response.data.message); }
        });
    };

    $scope.updateMe();

  }]);
