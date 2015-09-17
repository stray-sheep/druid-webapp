'use strict';

angular.module('druidWebApp')
  .controller('MainCtrl', ['$scope', '$http', '$window', '$state', 'API', function ($scope, $http, $window, $state, API) {

    $scope.user = null;
    $scope.auth = { username: '', password: '' };

    if ($window.sessionStorage.user) {
      $scope.user = JSON.parse($window.sessionStorage.user);
      $state.go('dashboard');
    }
    else {
      $state.go('index');
    }

    $scope.login = function() {
      if ($scope.auth.username && $scope.auth.password) {
        $http
          .post(API + '/auth/login', $scope.auth)
          .then( function(response) {
            console.debug(response.data);
            if (response.data.success) {
              $window.sessionStorage.token = response.data.token;
              $window.sessionStorage.user = JSON.stringify(response.data.user);
              var path = $window.location.pathname;
              $window.location.href = path;  // FIXME hammer of justice
            }
            else {
              alert(response.data.message);
            }
          });
      }
      else {
        console.debug('missing username or password');  // FIXME feedback
      }
    };

    $scope.logout = function() {
      console.debug('do logout');
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.user;
      delete $scope.user;
      $state.go('index');
    };

  }]);
