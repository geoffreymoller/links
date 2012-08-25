angular.module('links.ui', [])

  .factory('$ui', ['$rootScope', function(rootScope){

    return {
      paint: function($scope){
        rootScope.loaded = false;
        if($scope.search.indexOf('img') !== -1){
          $scope.listType = 'images';
          $scope.pageLength = 15; 
        }
      } 
    }

  }])

