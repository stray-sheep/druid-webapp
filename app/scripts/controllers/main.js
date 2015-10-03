'use strict';

angular.module('druidWebApp')
  .controller('MainCtrl', ['$scope', '$http', '$window', '$state', 'API', function ($scope, $http, $window, $state, API) {

    $scope.user = null;
    $scope.auth = { email: '', password: '' };
    $scope.register = { email: '', username: '', password: '', repeat: '' };

    if ($window.sessionStorage.user) {
      $scope.user = JSON.parse($window.sessionStorage.user);
      $state.go('dashboard');
    }
    else {
      $state.go('index');
    }

    $scope.login = function() {
      if ($scope.auth.email && $scope.auth.password) {
        $http
          .post(API + '/login', $scope.auth)
          .then( function(response) {
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
        alert('E-mail and password are required to login.');
      }
    };

    $scope.logout = function() {
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.user;
      delete $scope.user;
      $state.go('index');
    };

    $scope.register = function() {
      if ($scope.register.email && $scope.register.username && $scope.register.password && $scope.register.repeat) {
        $http
          .post(API + '/register', $scope.register)
          .then( function(response) {
            alert(response.data.message);
          });
      }
      else {
        alert('E-mail, username, password and repeat are required to register.');
      }
    };

  }]);
