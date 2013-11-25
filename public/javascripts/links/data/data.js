angular.module('links.data', [])

  .factory('$data', function($rootScope){

    var baseURI = 'https://geoffreymoller.cloudant.com/collect/_design/';

    return {

      comparator: function(a, b){
        return b.value.date - a.value.date;
      }

      , filter: function(rows, ands, nots){
        rows = this.filterNots(rows, nots); 
        rows = this.filterAnds(rows, ands); 
        return rows;
      }

      , filterAnds: function(rows, ands){
        return  _.filter(rows, function(row){
          return this.filterAnd(row, ands);
        }, this);
      }

      , filterAnd: function(row, ands){
        var found = true; 
        _.each(ands, function(searchAnd){
          found = found && !!_.find(row.value.tags, function(tag){
            return tag === searchAnd;
          });
        });
        return found;
      }

      , filterNots: function(rows, nots){
        return _.filter(rows, function(row){
          return this.filterNot(row, nots);
        }, this);
      }

      , filterNot: function(row, nots){
        var found = true;
        _.each(nots, function(not){
          if(_.find(row.value.tags, function(tag){
            return tag === not;
          })){
            found = false;
          };  
        }); 
        return found;
      } 

      , get: function(tag, callback){

        var self = this;
        var tags, uri;
        var recordSet = [];
        var promise;
        var ands = [], nots = [];

        function containsDash(str){
          return str[0] === '-';
        } 
        tags = tag ? tag.split(',') : [];
        ands = _.reject(tags, containsDash); 
        nots = _.filter(tags, containsDash); 
        nots = _.map(nots, function(not){
          return not.replace('-', ''); 
        });

        var all = tag === "all"; 
        if(!tag || all){
          uri = baseURI + 'uri/_view/uri?descending=true&limit=50&callback=?';
        }
        else {
          var keys = [];
          uri = baseURI + 'tags/_view/tags?descending=true&keys='
          _.each(tags, function(tag){
            keys.push(tag);
          });
          uri += encodeURIComponent(JSON.stringify(keys));
          uri += '&callback=?';
        }

        promise = $.getJSON(uri);
        promise.success(function(data){
          data.rows = self.filter(data.rows, ands, nots);
          recordSet = recordSet.concat(data.rows);
          $rootScope.loaded = true; 
          callback(recordSet);
        });

      }

    }

  });

