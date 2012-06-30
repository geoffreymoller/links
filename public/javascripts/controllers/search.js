var SearchController = function($scope, $http, $location, $routeParams) {

  var collection = new Backbone.Collection();
  collection.comparator = function(link){
    return -link.get('value').date;
  }

  $scope.pageName = 'Search';
  var tag = $routeParams.tag;
  var page = +$routeParams.page;
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

      var p = new pagination(page, 10);
      $scope.count = collection.length;
      $scope.links = collection.toJSON().slice(p.start, p.end);

      p.paint(collection.length, function(index){
        var location = window.location;
        var hash = location.hash.replace(/\d.*/, index);
        var suffix = hash.split('/').length === 3 ? '/' + index : '';
        window.location.href = location.origin + '/' + hash + suffix;
      });

    });
  });

}

