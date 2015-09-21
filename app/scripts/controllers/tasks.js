'use strict';

angular.module('druidWebApp')
  .controller('TasksCtrl', ['$scope', '$http', '$window', '$stateParams', 'API', function ($scope, $http, $window, $stateParams, API) {
    $scope.waiting = true;

    $scope.user = null;
    if ($window.sessionStorage.user) {
      $scope.user = JSON.parse($window.sessionStorage.user);
    }

    $scope.opts = { };
    $scope.toogleOpt = function(idx) {
      $scope.opts[idx] = !$scope.opts[idx];
    }

    $scope.updateMe = function() {
      $scope.queue = null;
      $scope.tasks = null;
      $scope.waiting = true;
      $scope.edit = { };
      $scope.showAddTask = false;
      $scope.opts = { };
      $scope.editing = null;  // task being edited

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

    $scope.taskEdit = function(t) {
      if ($scope.editing == null) {
        $scope.editing = angular.copy(t);
      }
      else {
        alert('Already editing something, please no multi-edits, thank you.')
      }
    };

    $scope.taskEditCancel = function() {
      $scope.editing = null;
    };

    $scope.taskEditUpdate = function() {
      if ( $scope.editing == null) { return; }

      $http
        .put(API+'/task/'+$scope.editing._id, { text: $scope.editing.text })
        .then( function(response) {
          if ( response.status === 200 ) { $scope.updateMe() }
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
