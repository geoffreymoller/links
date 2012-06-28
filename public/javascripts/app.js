angular.module('links.service', []);
angular.module('links.directive', []);
angular.module('links.filter', []);

angular.module('links', ['links.service', 'links.directive', 'links.filter'], function($routeProvider, $locationProvider){

  $routeProvider.when('/search/:tag', {
    templateUrl: 'partials/search.html',
    controller: SearchController
  });

  $routeProvider.when('/viz', {
    templateUrl: 'partials/viz.html',
    controller: VizController
  });

})

var SearchController = function($scope, $http, $routeParams) {

  var collection = new Backbone.Collection();
  collection.comparator = function(link){
    return -link.get('value').date;
  }

  $scope.page = 'Search';
  var tag = $routeParams.tag;
  var baseURI = 'https://geoffreymoller.cloudant.com/collect/_design/';
  var uri;

  if(tag && tag !== 'all'){
    uri = baseURI + 'tags/_view/tags?descending=true&key="' + tag + '"&callback=?';
  }
  else {
    uri = baseURI + 'uri/_view/uri?descending=true&limit=10&callback=?';
  }
  
  var promise = $.getJSON(uri);
  promise.success(function(data){
    $scope.$apply(function () {
      _.each(data.rows, function(link, index){
        collection.add(link);
      });
      $scope.links = collection.toJSON();
    });
  });

}

var VizController = function($scope) {
  $scope.page = 'Viz';
}

