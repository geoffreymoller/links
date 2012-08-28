var SearchController = function($scope, $rootScope, $http, $location, $routeParams, $data, $ui, $pagination) {

  //TODO - helpers to services
  //TODO - tests

  var collection = [];
  var location = $location;
  var tag = $routeParams.tag;
  var page = +$routeParams.page;

  $rootScope.pageName = 'Collect';
  $rootScope.pageLength = 5; 
  $rootScope.search = tag;

  $data.get(tag, callback);
  $ui.paint($scope);

  function callback(data){

    $scope.$apply(function() {

      _.each(data, function(link, index){
        goog.array.binaryInsert(collection, link, $data.comparator); 
      });

      $pagination.seed($scope.pageLength, page);
      $scope.count = collection.length;
      $scope.updateLinks($pagination);

      $pagination.paint(collection.length, function(index){
        $scope.$apply(function(){
          $pagination.seed($scope.pageLength, index);
          $scope.updateLinks($pagination);
        });
      });

      if(!($scope.count > $scope.pageLength)){
        $('.pagination').hide();
      }

    });
  };

  $scope.updateLinks = function($pagination){
    //debugger;
    $scope.links = collection.slice($pagination.start, $pagination.end + 1);
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
    else if(uri.indexOf('vimeo') != -1){
      return 'partials/media/vimeo.html'; 
    }
    else {
      return 'partials/media/link.html'; 
    }
  }

}

SearchController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$data', '$ui', '$pagination'];

