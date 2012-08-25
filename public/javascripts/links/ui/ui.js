angular.module('links.ui', [])

  .factory('$ui', ['$rootScope', function(rootScope){

    return {
      paint: function(){
        rootScope.loaded = false;
        if(rootScope.search.indexOf('img') !== -1){
          rootScope.listType = 'images';
          rootScope.pageLength = 6; 
        }
        else {
          delete rootScope.listType;
        }
      } 
    }

  }])

