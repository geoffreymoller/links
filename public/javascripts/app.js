angular.module('links.service', []);
angular.module('links.directive', []);
angular.module('links.filter', []).
  filter('date', function() {
    return function(value) {
      var date = value.date || value.date_created; 
      return (new Date(date)).toDateString();
    }
  }).
  filter('uri', function() {
    return function(value) {
      return value.uri || value.URI;
    }
  }).
  filter('selectedNote', function() {
    return function(value) {
      if(this.$index === this.active){
        value += ' active';
      } 
      return value; 
    }
  })

angular.module('links', ['links.service', 'links.directive', 'links.filter'], function($routeProvider, $locationProvider){

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

