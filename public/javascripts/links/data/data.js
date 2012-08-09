angular.module('links.data', [])

  .factory('$data', function(){

    var baseURI = 'https://geoffreymoller.cloudant.com/collect/_design/';

    return {

      get: function(tag, callback){

        console.time('get');
        var tags, uri;
        var recordSet = [];
        var promises = [];

        tags = tag.split(',');

        if(!tag){
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

        console.time('foo');
        _.each(promises, function(promise){
          promise.success(function(data){
            recordSet = recordSet.concat(data.rows);
          });
        });
        console.timeEnd('foo');

        console.time('bar');
        $.when.apply(null, promises).done(function(){
          console.log(recordSet);
          callback(recordSet);
        });
        console.timeEnd('bar');
        console.timeEnd('get');

      }

    }

  });
