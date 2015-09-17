'use strict';

angular.module('druidWebApp')
  .controller('QueuesCtrl', ['$scope', '$http', '$window', '$stateParams', 'API', function ($scope, $http, $window, $stateParams, API) {
    $scope.waiting = true;
    function updateMe() {
      $scope.showAddForm = false;
      $scope.edit = { user: $scope.user._id };
      $scope.waiting = true;
      $http
        .get(API+'/queues')
        .then( function(response) {
          if ( response.status === 200 ) {
            $scope.data = response.data;
            $scope.waiting = false;
          }
        });
    }

    $scope.user = null;
    if ($window.sessionStorage.user) {
      $scope.user = JSON.parse($window.sessionStorage.user);
    }

    $scope.showAddForm = false;
    $scope.edit = { user: $scope.user._id };
    $scope.organizations = [{name:'stray-sheep', _id:'55f8110cef8dafe56e260f88'}];  // FIXME

    updateMe();

    $scope.toogleAddForm = function() {
      $scope.showAddForm = !$scope.showAddForm;
    };

    $scope.queueAdd = function() {
      $http
        .post(API+'/queues', { name: $scope.edit.name, user: $scope.edit.user, organization: $scope.edit.organization })
        .then( function(response) {
          if ( response.status === 200) {
            $scope.edit = {};
            updateMe();
          }
        });
    };

    // $scope.queueDel = function(id) {
    //   $http
    //     .delete(API+'/queues/'+id.$oid)
    //     .then( function(response) {
    //       $http
    //         .get(API+'/queues')
    //         .then( function(response) {
    //           $scope.data = response.data;
    //         });
    //     });
    // };

  }]);
