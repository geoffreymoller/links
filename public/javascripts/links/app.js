angular.module('links', ['links.filter', 'links.data', 'links.ui'], function($routeProvider, $locationProvider){
  $routeProvider.when('/search/:tag', {
    templateUrl: 'partials/search.html',
    controller: SearchController
  }).
  when('/search/:tag/:page', {
    templateUrl: 'partials/search.html',
    controller: SearchController
  }).
  when('/viz', {
    templateUrl: 'partials/viz.html',
    controller: VizController
  }).
  otherwise({redirectTo: '/search/'});
})

var VizController = function($scope) {
  $scope.page = 'Viz';
}

