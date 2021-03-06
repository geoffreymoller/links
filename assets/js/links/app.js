angular.module('links', ['links.filter', 'links.data', 'links.ui', 'links.pagination'], function($routeProvider, $locationProvider){
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
}).run(function($rootScope){
  $(document).on('keydown', function(e){
    $rootScope.$broadcast('keydown', e);
  });
});

var VizController = function($scope) {
  $scope.page = 'Viz';
}

