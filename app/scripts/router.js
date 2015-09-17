'use strict';

angular.module('druidWebApp')
  .config( function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('index');

    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/index.html',   
      })
      .state('queues', {
        url: '/queues',
        templateUrl: 'views/queues.html'
      })
      .state('tasks', {
        url: '/tasks/:id',
        templateUrl: 'views/tasks.html'
      })
     .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html'
      });

  });
