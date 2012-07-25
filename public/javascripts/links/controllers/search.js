var SearchController = function($scope, $http, $location, $routeParams) {
  //TODO - helpers to services
  //TODO - tests

  var collection = new Backbone.Collection();
  collection.comparator = function(link){
    return -link.get('value').date;
  }

  $scope.pageName = 'Collect';
  $scope.pageLength = 5; 

  $scope.active = null; 
  $scope.notesClick = function(){
    if($scope.active === this.$index){
      $scope.active = null; 
    }
    else {
      $scope.active = this.$index;
    }
  }
  $scope.notesClass = 'notes';

  var tag = $routeParams.tag;
  var page = +$routeParams.page;
  var baseURI = 'https://geoffreymoller.cloudant.com/collect/_design/';
  var uri;

  if(tag && tag !== 'all'){
    $scope.pageTag = tag;
    uri = baseURI + 'tags/_view/tags?descending=true&key="' + tag + '"&callback=?';
  }
  else {
    uri = baseURI + 'uri/_view/uri?descending=true&limit=10&callback=?';
  }

  //TODO - ui-keypress
  $(document).on('keypress', function(e){
    if(e.keyCode === 47){
      e.preventDefault();
      $('#search').focus().val('');
    }
  });

  //TODO - inject location
  var location = $location;
  $scope.fireSearch = function(search){
    location.path('/search/' + search);
  }

  var promise = $.getJSON(uri);
  promise.success(function(data){
    $scope.$apply(function () {

      _.each(data.rows, function(link, index){
        collection.add(link);
      });

      var p = new pagination(page, $scope.pageLength);
      $scope.count = collection.length;
      $scope.links = collection.toJSON().slice(p.start, p.end + 1);

      p.paint(collection.length, function(index){
        var location = window.location;
        var hash = location.hash.replace(/\d.*/, index);
        var suffix = hash.split('/').length === 3 ? '/' + index : '';
        window.location.href = location.origin + '/' + hash + suffix;
      });

      if(!($scope.count > $scope.pageLength)){
        $('.pagination').hide();
      }

    });
  });

}

