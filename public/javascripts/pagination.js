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
            , itemsOnPage: 10
            , cssStyle: 'compact-theme'
          });
        }

    }

    //TODO - write a fucking test
    this.page = page ? page - 1 : 0;
    this.start = this.page * pageLength;
    if(this.page === 0){
        this.end = pageLength;
    }
    else {
        this.end = this.start + pageLength;
    }

}
