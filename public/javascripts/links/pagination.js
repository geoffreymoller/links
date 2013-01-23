
angular.module('links.pagination', [])

  .factory('$pagination', function($rootScope){

    return {
  
      paint: function(collectionLength, callback){
      
        function pageSelectCallback(index){
            callback(index);
            return false;
        }

        if(collectionLength > this.pageLength){
          $('.pagination').pagination({
            onClick: _.bind(pageSelectCallback, this)
            , currentPage: this.page + 1
            , items: collectionLength
            , itemsOnPage: this.pageLength
            , cssStyle: 'compact-theme'
          });
        }

      }

      , seed: function(pageLength, page){

        this.pageLength = pageLength;
        this.page = page ? page - 1 : 0;
        this.start = this.page * this.pageLength;
        var end = this.pageLength - 1;
        if(this.page === 0){
            this.end = end; 
        }
        else {
            this.end = this.start + end; 
        }

      }

    }



  });



