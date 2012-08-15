angular.module('links.data', [])

  .factory('$data', function(){

    var baseURI = 'https://geoffreymoller.cloudant.com/collect/_design/';

    return {

      filter: function(rows, ands, nots){
        _.each(rows, _.bind(function(row, index){
          this.filterAnd(rows, index, row, ands);
          this.filterNot(rows, index, row, nots);
        }, this));
        return rows;
      }

      , filterAnd: function(rows, index, row, ands){
        if(ands && ands.length && ands.length > 1){
          var found = true; 
          _.each(ands, function(searchAnd){
            found = found && _.find(row.value.tags, function(tag){
              return tag === searchAnd;
            });
          });
          if(found) { return };
          delete rows[index];
        }
      }

      , filterNot: function(rows, index, row, nots){
        if(nots && nots.length){
        _.each(nots, function(not){
          if(_.find(row.value.tags, function(tag){
            return tag === not;
          })){
            delete rows[index];
          };
        });
        }
      }

      , get: function(tag, callback){

        var self = this;
        var tags, uri;
        var recordSet = [];
        var promises = [];
        var ands = [], nots = [];

        function containsDash(str){
          return str[0] === '-';
        } 
        tags = tag.split(',');
        ands = _.reject(tags, containsDash); 
        nots = _.filter(tags, containsDash); 
        nots = _.map(nots, function(not){
          return not.replace('-', ''); 
        });

        var all = tag === "all"; 
        if(!tag || all){
          uri = baseURI + 'uri/_view/uri?descending=true&limit=10&callback=?';
          promises.push($.getJSON(uri));
        }
        else {
          //get each tag from couch until cloudant instance supports "keys" param
          _.each(tags, function(tag){
            uri = baseURI + 'tags/_view/tags?descending=true&key="' + tag + '"&callback=?';
            promises.push($.getJSON(uri));
          });
        }

        _.each(promises, function(promise){
          promise.success(function(data){
            data.rows = self.filter(data.rows, ands, nots);
            recordSet = recordSet.concat(data.rows);
          });
        });

        $.when.apply(null, promises).done(function(){
          callback(recordSet);
        });

      }

    }

  });
