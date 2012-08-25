var SearchController = function($scope, $rootScope, $http, $location, $routeParams, $data, $ui) {

  //TODO - helpers to services
  //TODO - tests

  var collection = [];
  var tag = $routeParams.tag;
  $rootScope.pageName = 'Collect';
  $rootScope.pageLength = 5; 
  $rootScope.search = tag;

  var page = +$routeParams.page;
  $data.get(tag, callback);
  $ui.paint($scope);

  function callback(data){

    $scope.$apply(function() {

      _.each(data, function(link, index){
        goog.array.binaryInsert(collection, link, $data.comparator); 
      });

      var p = new pagination(page, $scope.pageLength);
      $scope.count = collection.length;
      $scope.links = collection.slice(p.start, p.end + 1);

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
  };

  $scope.handleDelete = function(link){
    var id = link.value._id;
    var rev = link.value._rev;
    if(confirm('Are you sure you want to delete the link?')){
      var promise = $http.get('/delete?id=' + id + '&rev=' + rev);
      promise.success(function(){
        //TODO - success alert/dialog
        window.location.reload();
      });
      promise.error(function(){
        alert('ERROR DELETING LINK!');
      });
    }
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

  $scope.linkMediaUrl = function(link){
    //support hacked (qs) image uris for now
    var uri = link.value.URI || link.value.uri;
    uri = uri.split('?')[0];
    if(uri.search(/png|jpg|jpeg|gif$/) > -1){
      return 'partials/media/image.html'; 
    }
    else if(uri.indexOf('http://www.youtube.com/watch') === 0){
      return 'partials/media/video.html'; 
    }
    else {
      return 'partials/media/link.html'; 
    }
  }

}

SearchController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$data', '$ui'];

