var pagination = function(page, pageLength){

    this.paint = function(collectionLength, callback){
      
        function pageSelectCallback(index){
            callback(index);
            return false;
        }

        if(collectionLength > pageLength){
          $('.pagination').pagination({
            onClick: _.bind(pageSelectCallback, this)
            , currentPage: this.page + 1
            , items: collectionLength
            , itemsOnPage: pageLength
            , cssStyle: 'compact-theme'
          });
        }

    }

    this.page = page ? page - 1 : 0;
    this.start = this.page * pageLength;
    var end = pageLength - 1;
    if(this.page === 0){
        this.end = end; 
    }
    else {
        this.end = this.start + end; 
    }

}

module.exports.pagination = pagination;
