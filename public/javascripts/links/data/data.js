angular.module('links.data', [])

  .factory('$data', function(){

    var baseURI = 'https://geoffreymoller.cloudant.com/collect/_design/';

    return {

      filter: function(rows, tags, filters){

        _.each(rows, function(row, index){

          var proceed = true;

          if(tags && tags.length && tags.length > 1){
            var found = true; 
            _.each(tags, function(searchTag){
              found = found && _.find(row.value.tags, function(tag){
                return tag === searchTag;
              });
            });

            if(found) { return };
            delete rows[index];
            var proceed = false;
          }

          if(proceed && filters && filters.length){
          _.each(filters, function(filter){
            if(_.find(row.value.tags, function(tag){
              return tag === filter;
            })){
              delete rows[index];
            };
          });
          }

        });

        return rows;

      }

      , get: function(tag, callback){

        var self = this;
        var tags, uri;
        var recordSet = [];
        var promises = [];
        var filters = [];

        tags = tag.split(',');
        var all = tag === "all"; 

        if(!tag || all){
          uri = baseURI + 'uri/_view/uri?descending=true&limit=10&callback=?';
          promises.push($.getJSON(uri));
        }
        else {
          //get each tag from couch until cloudant instance supports "keys" param
          _.each(tags, function(tag){
            if(tag[0] === '-'){
              filters.push(tag.replace('-', ''));
            }
            else {
              uri = baseURI + 'tags/_view/tags?descending=true&key="' + tag + '"&callback=?';
              promises.push($.getJSON(uri));
            }
          });
        }

        _.each(promises, function(promise){
          promise.success(function(data){
            data.rows = self.filter(data.rows, tags, filters);
            recordSet = recordSet.concat(data.rows);
          });
        });

        $.when.apply(null, promises).done(function(){
          callback(recordSet);
        });

      }

    }

  });
