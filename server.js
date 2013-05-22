
/**
 * Module dependencies.
 */

var express = require('express')
  , sys = require('util')
  , routes = require('./routes')
  , cradle = require('cradle')
  , request = require('request')
  , uuid = require('node-uuid')
  , knox = require('knox')
  , q = require('q')
  , port

var client = knox.createClient({
  key: process.env.AMAZON_KEY
  , secret:  process.env.AMAZON_SECRET
  , bucket: 'geoffreymoller-collect'
});
var connection = new(cradle.Connection)('https://geoffreymoller.cloudant.com', 443, {
  auth: { username: process.env.DB_API_KEY, password: process.env.DB_API_SECRET }
})
var db = connection.database('collect');
var app = module.exports = express.createServer();

var EMBEDLY_KEY = process.env.EMBEDLY_KEY;
var embedly = require('embedly')
  , Api = embedly.Api
  , api = new Api({user_agent: 'Mozilla/5.0 (compatible; myapp/1.0; u@my.com)', key: EMBEDLY_KEY})

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  port = 1972;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  port = 80;
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/link', function(req, res){
  var uri = req.query.URI;
  var callback = getCallback('Link Retrieved!', res);
  db.view('uri/uriPlain', {key: uri}, callback)
});

app.post('/link', function(req, res){

  var link = req.body.value;
  var uri = link.uri;
  var isImage = /(\.jpg|\.jpeg|\.gif|\.png)$/.test(uri)
  var saveImage = link.saveImage === 'true'; 

  var deferred = getEmbedlyInfo(uri); 
  deferred.then(function(embedlyObject){
    getImageAndSave(uri, embedlyObject);
  }, function(res){
    throw new Error('Embedly Error: ' + res.statusCode);
  });

  function getImageAndSave(uri, embedlyObject){
    if(!isImage){
      _save(uri, [], embedlyObject);
    }
    else if(isImage && !saveImage){
      _save(uri, ['img'], embedlyObject);
    }
    else {
      deferred = upload_image(uri);
      deferred.then(function(s3Url){
        _save(s3Url, ['img'], embedlyObject);
      }, function(res){
        console.log('S3 Error: ' + res.statusCode);
        throw new Error('S3 Error: ' + res.statusCode);
      });
    }
  }

  function _save(path, autoTags, embedlyObject){

    var payload = {
        title: link.title
        , URI: path
        , notes: link.notes
        , date: new Date().getTime()
        , thumbnail_url: embedlyObject.thumbnail_url
    }

    var tags = link.tags;
    if(tags){
        if(autoTags.length){
          tags = tags.concat(autoTags);
        }
        payload.tags = tags;
    }
    console.log(typeof tags);
    console.log(tags);

    var id = uuid()
    var callback = getCallback('Document Saved!', res);
    db.save(id, payload, callback);
  }

});

//TODO - remove rest of non-restful endpoints
app.post('/save', function(req, res){

  var body = req.body;
  var uri = body.uri;
  var isImage = /(\.jpg|\.jpeg|\.gif|\.png)$/.test(uri)
  var saveImage = body.saveImage === 'true'; 

  var deferred = getEmbedlyInfo(uri); 
  deferred.then(function(embedlyObject){
    getImageAndSave(uri, embedlyObject);
  }, function(res){
    throw new Error('Embedly Error: ' + res.statusCode);
  });

  function getImageAndSave(uri, embedlyObject){
    if(!isImage){
      _save(uri, [], embedlyObject);
    }
    else if(isImage && !saveImage){
      _save(uri, ['img'], embedlyObject);
    }
    else {
      deferred = upload_image(uri);
      deferred.then(function(s3Url){
        _save(s3Url, ['img'], embedlyObject);
      }, function(res){
        console.log('S3 Error: ' + res.statusCode);
        throw new Error('S3 Error: ' + res.statusCode);
      });
    }
  }

  function _save(path, autoTags, embedlyObject){

    var payload = {
        title: body.title
        , URI: path
        , notes: body.notes.match(/\S/) ? body.notes : null 
        , date: new Date().getTime()
        , thumbnail_url: embedlyObject.thumbnail_url
    }

    var tags = body.tags;
    if(tags){
        tags = tags.split(',');
        if(autoTags.length){
          tags = tags.concat(autoTags);
        }
        payload.tags = tags;
    }

    var callback = getCallback('Document Saved!', res);
    var id = body.id;

    if(id){
      db.merge(id, payload, callback);
    }
    else {
      id = uuid();
      db.save(id, payload, callback);
    }
  }

});

app.get('/delete', function(req, res){
  var query = req.query;
  var id = query.id;
  var rev = query.rev;
  var callback = getCallback('Link Deleted!', res);
  db.remove(id, rev, callback); 
});

function upload_image(path){

  var deferred = q.defer();

  request(path, {encoding: null}, function(err, res, body) {

    if(!err && res.statusCode == 200) {

      var path = res.request.path;
      if(path.indexOf('/') !== -1){
        var parts = path.split('/');
        path = parts[parts.length - 1];
      }
      var date = new Date();
      path = '/' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + path;

      var req = client.put(path, {
        'Content-Type': res.headers['content-type']
        , 'Content-Length': res.headers['content-length']
        , 'x-amz-acl': 'public-read'
      });

      req.on('response', function(res) {
        if(res.statusCode === 200){
          var s3Url = res.socket._httpMessage.url;
          deferred.resolve(s3Url);
        }
        else {
          deferred.reject(res);
        }
      });

      req.end(body);
    }
  });

  return deferred.promise;

}

function getEmbedlyInfo(url){
  var deferred = q.defer();
  api.oembed({url: url}).on('complete', function(objs) {
    deferred.resolve(objs[0]);
  }).on('error', function(e) {
    deferred.reject(e);
  }).start()
  return deferred.promise;
}

function getCallback(message, response){
  return function(er, ok){
    if (er) {
      response.send(er);
      throw new Error(JSON.stringify(er));
    }
    else{
      sys.puts(message);
      sys.puts(ok);
      response.send(ok);
    }
  }
}

port = process.env.PORT || port;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
