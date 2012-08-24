angular.module('links.ui', [])

  .factory('$ui', function(){

    return {
      paint: function($scope){
        if($scope.search.indexOf('img') !== -1){
          $scope.listType = 'images';
          $scope.pageLength = 15; 
        }
      } 
    }

  })

