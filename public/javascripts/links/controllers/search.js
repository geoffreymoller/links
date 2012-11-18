var SearchController = function($scope, $rootScope, $http, $location, $routeParams, $data, $ui, $pagination) {

  //TODO - more tests

  var collection = [];
  var location = $location;
  var tag = $routeParams.tag;
  var page = +$routeParams.page;

  $rootScope.pageName = 'Collect';
  $rootScope.pageLength = 5; 
  $rootScope.search = tag;

  $data.get(tag, callback);
  $ui.paint($scope);

  $(document).on('keydown', function(e){
    $ui.keydown(e);
  });

  var location = $location;
  $scope.fireSearch = function(search){
    location.path('/search/' + search);
  }

  $scope.mode = 'view';
  $scope.selectedItem = 0;

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

  $scope.getTags = function(link){
    return link.value.tags.join(' '); 
  };

  $scope.updateLinks = function($pagination){
    $scope.links = collection.slice($pagination.start, $pagination.end + 1);
  };

  $scope.handleEdit = function(link){
    link.edit = true;
    $scope.selectedItem = this.$index;
  };

  $scope.handleCancel = function(link){
    if(typeof link.value.tags === 'string'){
      link.value.tags = link.value.tags.split(',');
    }
    $scope.datas = angular.copy($scope.initial);
    $scope.mode = 'view'
    link.edit = false;
  };

  $scope.handleSave = function(link){
    var link = link || $scope.links[$scope.selectedItem];
    if(typeof link.value.tags === 'string'){
      link.value.tags = link.value.tags.split(',');
    }
    var params = {
      id: link.id   
      , title: link.value.title   
      , tags: link.value.tags.join()
      , notes: link.value.notes   
    };

    var promise = $http.post('/update', params);
    promise.success(function(){
      //TODO - success message
      link.edit = false;
      $scope.mode = 'view';
    });
    promise.error(function(){
      alert('ERROR SAVING LINK!');
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

  $scope.itemClass = 'clearfix';
  $scope.notesClass = 'notes';
  $scope.selectedNote = null; 
  $scope.notesClick = function(){
    if($scope.selectedNote === this.$index){
      $scope.selectedNote = null; 
    }
    else {
      $scope.selectedNote = this.$index;
    }
  }

  $scope.$on('vim', function(event, keyCode) {
    if($scope.mode === 'edit') return;
    $scope.handleVim(event, keyCode);
  });
  $scope.$on('esc', function(event, keyCode) {
    $scope.$apply(function() {
      $scope.links[$scope.selectedItem].edit = false;
      $scope.mode = 'view'
    });
  });
  $scope.$on('enter', function(e, originalEvent) {
    if($scope.mode === 'edit' && originalEvent.target.nodeName === 'INPUT'){
      $scope.handleSave();
    }
    else {
      $scope.$apply(function() {
        $scope.links[$scope.selectedItem].edit = true;
        $scope.mode = 'edit'
      });
    }
  });

  $scope.handleVim = function(event, keyCode){
    var up = keyCode === 75;
    if(up){
      if($scope.selectedItem === 0){
        return;
      }
      else {
        $scope.$apply(function() {
          $scope.selectedItem--;
        });
      }
    }
    else {
      if($scope.selectedItem === $scope.pageLength - 1){
        return;
      }
      else {
        $scope.$apply(function() {
          $scope.selectedItem++;
        });
      }
    }
  }


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

