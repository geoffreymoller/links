angular.module('links.service', []);
angular.module('links.directive', []);
angular.module('links.filter', []);

angular.module('links', ['links.service', 'links.directive', 'links.filter'], function($routeProvider, $locationProvider){

  $routeProvider.when('/search', {
    templateUrl: 'partials/search.html',
    controller: SearchController
  });

  $routeProvider.when('/viz', {
    templateUrl: 'partials/viz.html',
    controller: VizController
  });

})

var SearchController = function($scope, $http) {

  $scope.page = 'Search';

  var uri = 'https://geoffreymoller.cloudant.com/collect/_design/uri/_view/uri?descending=true&limit=10&callback=?';
  var promise = $.getJSON(uri);
  promise.success(function(data){
    $scope.$apply(function () {
      $scope.links = data.rows;
    });
  });

}

var VizController = function($scope) {
  $scope.page = 'Viz';
}

