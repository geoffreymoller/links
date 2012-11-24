angular.module('links.ui', [])

  .factory('$ui', ['$rootScope', function($rootScope){

    return {
      paint: function(){
        $rootScope.loaded = false;
        if($rootScope.search.indexOf('img') !== -1){
          $rootScope.listType = 'images';
          $rootScope.pageLength = 6; 
        }
        else {
          delete $rootScope.listType;
        }
      } 
      , keydown: function(e){
        if(e.keyCode === 74 || e.keyCode === 75){
          if($(e.target).attr('id') !== 'search'){
            $rootScope.$broadcast('vim', e.keyCode);
          }
        }
        else if(_.find([37, 39, 78, 80], function(num) { return num === e.keyCode })){
          $rootScope.$broadcast('pagination', (e.keyCode === 37 || e.keyCode === 80) ? 0 : 1);
        }
        else if(e.keyCode === 69){
          $rootScope.$broadcast('edit', e);
        }
        else if(e.keyCode === 70){
          $rootScope.$broadcast('follow', e);
        }
        else if(e.keyCode === 27){
          $rootScope.$broadcast('esc');
        }
        else if(e.keyCode === 13){
          $rootScope.$broadcast('enter', e);
        }
        else if(e.target.nodeName === "TEXTAREA" || e.target.nodeName === "INPUT"){
          return;
        }
        else if(e.keyCode === 191){
          e.preventDefault();
          $('#search').focus().val('');
        }

      }
    }

  }])

