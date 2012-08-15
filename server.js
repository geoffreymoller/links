
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
  port = 3000;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  port = 80;
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/getURIByKey', function(req, res){
  var query = req.query;
  var URI = query.URI;
  var callback = getCallback('Link Retrieved!', res);
  db.view('uri/uriPlain', {key: URI}, callback)
});

app.post('/save', function(req, res){

  var body = req.body;
  var uri = body.uri;
  var isImage = /(\.jpg|\.jpeg|\.gif|\.png)$/.test(uri)
  var saveImage = body.saveImage === 'true'; 

  if(!isImage){
    _save(uri);
  }
  else if(isImage && !saveImage){
    _save(uri, ['img']);
  }
  else {
    var deferred = upload_image(uri);
    deferred.then(function(s3Url){
      _save(s3Url, ['img']);
    }, function(res){
      console.log('S3 Error: ' + res.statusCode);
      throw new Error('S3 Error: ' + res.statusCode);
    });
  }

  function _save(path, autoTags){

    var payload = {
        title: body.title,
        URI: path,
        notes: body.notes.match(/\S/) ? body.notes : null ,
        date: new Date().getTime()
    }

    var tags = body.tags;
    if(tags){
        tags = tags.split(',');
        if(autoTags){
          tags = tags.concat(autoTags);
        }
        payload.tags = tags;
    }

    var id = uuid()
    var callback = getCallback('Document Saved!', res);
    db.save(id, payload, callback);
  }

});

app.post('/update', function(req, res){

  var id = req.body.id; 

  var tags = req.body.tags;
  if(tags && tags.length){
      tags = tags.split(',');
  }
  else {
      tags = []; 
  }

  var payload = {
    "title": req.body.title,
    "tags": tags,
    "date_modified": new Date().getTime(),
    "notes": req.body.notes,
    "deleted": false
  }

  var id = req.body.id;
  var callback = getCallback('Link Updated!', res);
  db.merge(id, payload, callback);

})

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
        'Content-Type': res.headers['content-type'],
        'Content-Length': res.headers['content-length']
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
