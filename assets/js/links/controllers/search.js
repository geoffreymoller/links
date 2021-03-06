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
          return false;
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
    link.value.tags = _.uniq(_.map(link.value.tags, function(tag){
      return tag.toLowerCase();
    }));
    var _link = {
      id: link.id   
      , value: {
        title: link.value.title   
        , tags: link.value.tags.join()
        , notes: link.value.notes   
      }
    };

    //TODO -  use a resource
    var promise = $http.post('/link', _link);
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
    var id = link.id;
    var rev = link.value._rev;
    if(confirm('Are you sure you want to delete the link?')){
      //TODO - use a resource 
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

  $scope.blur = function(){
    _.defer(function(){
      document.activeElement.blur()
    });
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

  //TODO - factor out common event patterns/restrictions
  $scope.$on('keydown', function(event, originalEvent) {
    $ui.keydown(originalEvent);
  });

  $scope.$on('pagination', function(event, originalEvent, direction) {
    $scope.selectedItem = 0;
    if($scope.mode === 'edit') return;
    if(originalEvent.target.nodeName === 'INPUT') return;
    var node = direction ? '.next' : '.prev';
    node = $('.pagination ' + node);
    node.length && node.trigger('click');
  });

  $scope.$on('edit', function(event, originalEvent) {
    if($scope.mode === 'edit') return;
    if(originalEvent.target.nodeName === 'INPUT') return;
    $scope.$apply(function() {
      $scope.links[$scope.selectedItem].edit = true;
      $scope.mode = 'edit';
      //HORRORZ - TODO - use a directive else find the node
      _.defer(function(){
        $('input.tags:visible')[0].focus();
      });
    });
  });

  $scope.$on('vim', function(event, keyCode) {
    if($scope.mode === 'edit') return;
    $scope.handleVim(event, keyCode);
  });

  $scope.$on('esc', function(event, keyCode) {
    $scope.$apply(function() {
      $scope.links[$scope.selectedItem].edit = false;
      $scope.mode = 'view'
    });
    $scope.blur();
  });

  $scope.$on('follow', function(scope, event) {
    if($scope.mode === 'edit') return;
    if(event.target.nodeName === 'INPUT') return;
    var links = scope.currentScope.links;
    var link = links[$scope.selectedItem];
    window.open(link.value.URI);
  });

  $scope.$on('enter', function(e, originalEvent) {
    if(originalEvent.shiftKey){
      if($scope.mode === 'edit'){
        originalEvent.preventDefault();
        $scope.handleSave();
      }
      else {
        $scope.$apply(function() {
          $scope.links[$scope.selectedItem].edit = true;
          $scope.mode = 'edit'
        });
      }
    }
    else {
      if($scope.mode === 'view'){
        if($scope.selectedNote === $scope.selectedItem){
          $scope.$apply(function() {
            $scope.selectedNote = null; 
          });
        }
        else {
          $scope.$apply(function() {
            $scope.selectedNote = $scope.selectedItem;
          });
        }
      }
      else if(originalEvent.target.nodeName === 'INPUT'){ 
        originalEvent.preventDefault();
        $scope.handleSave();
      }
      else if(originalEvent.target.nodeName === 'TEXTAREA'){ 
        return;
      }
    }
    $scope.blur();
  });

  $scope.handleVim = function(event, keyCode){
    $scope.selectedNote = null; 
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
    var uri = $scope.uri(link);
    if($scope.isImage(uri)){
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

  $scope.uri = function(link){
    return link.value.URI || link.value.uri;
  }

  $scope.isImage = function(uri){
    return uri.search(/png|jpg|jpeg|gif$/) !== -1;
  }

  $scope.showThumbnail = function(link){
    return $scope.listType !== 'images' && !$scope.isImage($scope.uri(link)) && link.value.thumbnail_url;
  }

}

SearchController.$inject = ['$scope', '$rootScope', '$http', '$location', '$routeParams', '$data', '$ui', '$pagination'];

