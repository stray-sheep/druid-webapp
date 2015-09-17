'use strict';

var app = angular
  .module('druidWebApp', ['ui.router','nvd3'])
  .constant('API', 'http://localhost:5000');

app.factory('authInterceptor', function($rootScope, $q, $window) {
    return {
      request: function(config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
              config.headers.Authorization = $window.sessionStorage.token;
          }
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          config.headers['Content-Type'] = 'application/json;charset=UTF-8';
          return config;
      }
    };
  });

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  }]);
